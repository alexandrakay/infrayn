import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { ReviewMode, ArchitectureReview } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { userId, mode, input, output, systemName } = (await req.json()) as {
    userId: string;
    mode: ReviewMode;
    input: string;
    output: ArchitectureReview;
    systemName?: string;
  };

  if (!userId || !mode || !input || !output) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const db = getAdminDb();
  const ref = await db.collection("reviews").add({
    userId,
    mode,
    input,
    output,
    ...(systemName?.trim() ? { systemName: systemName.trim() } : {}),
    createdAt: Date.now(),
  });

  return NextResponse.json({ id: ref.id }, { status: 201 });
}
