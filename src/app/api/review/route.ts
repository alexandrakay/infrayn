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

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8096,
    system: buildSystemPrompt(mode),
    messages: [{ role: "user", content: input }],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";

  const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

  let review;
  try {
    review = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse review response" },
      { status: 500 }
    );
  }

  return NextResponse.json({ review, remaining }, { status: 200 });
}
