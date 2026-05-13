import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAdminDb } from "@/lib/firebase-admin";
import { buildSystemPrompt } from "@/lib/prompts";
import { ReviewMode, RateLimitEntry } from "@/lib/types";

const client = new Anthropic();

const ANON_LIMIT = 3;
const AUTH_LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

async function checkRateLimit(
  key: string,
  limit: number
): Promise<{ allowed: boolean; remaining: number }> {
  const db = getAdminDb();
  const ref = db.collection("rateLimits").doc(key);
  const snap = await ref.get();
  const now = Date.now();

  if (!snap.exists) {
    await ref.set({ count: 1, windowStart: now } satisfies RateLimitEntry);
    return { allowed: true, remaining: limit - 1 };
  }

  const data = snap.data() as RateLimitEntry;
  const elapsed = now - data.windowStart;

  if (elapsed > WINDOW_MS) {
    await ref.set({ count: 1, windowStart: now } satisfies RateLimitEntry);
    return { allowed: true, remaining: limit - 1 };
  }

  if (data.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await ref.update({ count: data.count + 1 });
  return { allowed: true, remaining: limit - data.count - 1 };
}

export async function POST(req: NextRequest) {
  const { input, mode, userId } = (await req.json()) as {
    input: string;
    mode: ReviewMode;
    userId?: string;
  };

  if (!input?.trim()) {
    return NextResponse.json({ error: "Input is required" }, { status: 400 });
  }

  const rateLimitKey = userId
    ? `user_${userId}`
    : `ip_${req.headers.get("x-forwarded-for") ?? "unknown"}`;
  const limit = userId ? AUTH_LIMIT : ANON_LIMIT;

  const { allowed, remaining } = await checkRateLimit(rateLimitKey, limit);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in an hour." },
      { status: 429 }
    );
  }

  const stream = client.beta.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 8096,
    betas: ["prompt-caching-2024-07-31"],
    system: [{ type: "text", text: buildSystemPrompt(mode), cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: input }],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        // Send remaining header with rate limit info
        controller.enqueue(
          encoder.encode(`\n__REMAINING__:${remaining}`)
        );
      } catch {
        controller.error(new Error("Stream failed"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
