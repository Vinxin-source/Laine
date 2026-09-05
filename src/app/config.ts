/**
 * Laine pricing & Merchant of Record
 * Founder in Nigeria → use MoR (Lemon Squeezy or Dodo) for US/EU tax + payouts.
 */

export const PLAN = {
  id: "laine_maker_monthly",
  name: "Laine Maker",
  priceUsd: 9,
  interval: "month" as const,
  tagline: "Circles, richer Guide, and calm tools for serious makers",
};

export const PAID_FEATURES = [
  "Create Circles (invite-only rooms up to 30)",
  "Unlimited Circle memberships",
  "Richer Laine Guide insights",
  "Priority stash tools as we ship them",
  "Support independent craft software",
] as const;

export const FREE_FEATURES = [
  "Full yarn stash & projects",
  "Search, edit, offline save",
  "Laine Guide (data-grounded, free layer)",
  "Join Circles with an invite code",
  "Add to phone (PWA)",
] as const;

/** Set in .env.local when you create products */
export function getCheckoutUrl(): string | null {
  // Lemon Squeezy overlay/checkout link OR Dodo payment link
  return process.env.NEXT_PUBLIC_CHECKOUT_URL || null;
}

export function getBillingProvider(): "lemon" | "dodo" | "none" {
  const p = (process.env.NEXT_PUBLIC_BILLING_PROVIDER || "").toLowerCase();
  if (p === "lemon" || p === "lemonsqueezy") return "lemon";
  if (p === "dodo") return "dodo";
  return "none";
}
