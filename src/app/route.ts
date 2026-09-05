import { NextRequest, NextResponse } from "next/server";

/**
 * Placeholder webhook for Lemon Squeezy or Dodo.
 * When you have a provider, verify signature and set profiles.is_paid in Supabase.
 *
 * You only need to:
 * 1. Set BILLING_WEBHOOK_SECRET in Vercel env
 * 2. Point provider webhook to https://YOUR_DOMAIN/api/webhooks/billing
 * 3. Uncomment provider-specific verification
 */
export async function POST(req: NextRequest) {
  const secret = process.env.BILLING_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, message: "Webhook secret not configured yet" },
      { status: 503 }
    );
  }

  const raw = await req.text();

  // TODO: verify signature with Lemon Squeezy / Dodo using `secret`
  // TODO: on subscription_created / updated active → set is_paid true
  // TODO: on cancelled / expired → set is_paid false

  console.log("Billing webhook received", raw.slice(0, 200));

  return NextResponse.json({ received: true });
}
