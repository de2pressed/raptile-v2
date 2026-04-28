import { NextResponse } from "next/server";

interface NotifyPayload {
  email?: string;
  productHandle?: string;
  variantId?: string | null;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json()) as NotifyPayload;
  const email = body.email?.trim() ?? "";
  const productHandle = body.productHandle?.trim() ?? "";
  const variantId = body.variantId?.trim() ?? null;

  if (!isValidEmail(email) || !productHandle) {
    return NextResponse.json({ success: false, message: "Enter a valid email address." }, { status: 400 });
  }

  const payload = {
    email,
    product_handle: productHandle,
    variant_id: variantId,
    created_at: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    console.log("[notify]", payload);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/notify_requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    } catch (error) {
      console.error("[notify] Supabase insert failed", error);
    }
  } else {
    console.log("[notify] No Supabase credentials configured, stored in logs only.");
  }

  return NextResponse.json({
    success: true,
    message: "We'll let you know when this is back.",
  });
}
