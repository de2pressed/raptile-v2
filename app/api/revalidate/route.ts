import { createHmac, timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { readEnv } from "@/lib/env";

export async function POST(request: NextRequest) {
  const secret = readEnv("SHOPIFY_REVALIDATION_SECRET");
  const signature = request.headers.get("x-shopify-hmac-sha256");

  if (!secret || !signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = await request.text();
  const digest = createHmac("sha256", secret).update(body, "utf8").digest("base64");

  const expected = Buffer.from(digest, "utf8");
  const received = Buffer.from(signature, "utf8");

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  revalidateTag("collection");

  return NextResponse.json({ revalidated: true });
}
