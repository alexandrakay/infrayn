import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { RateLimitEntry } from "@/lib/types";

const AUTH_LIMIT = 20;

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminDb();
  const snap = await db.collection("rateLimits").doc(`user_${userId}`).get();

  if (!snap.exists) {
    return NextResponse.json({ used: 0, limit: AUTH_LIMIT, windowStart: Date.now() });
  }

  const data = snap.data() as RateLimitEntry;
  const now = Date.now();
  const windowExpired = now - data.windowStart > 60 * 60 * 1000;

  if (windowExpired) {
    return NextResponse.json({ used: 0, limit: AUTH_LIMIT, windowStart: now });
  }

  return NextResponse.json({ used: data.count, limit: AUTH_LIMIT, windowStart: data.windowStart });
}
