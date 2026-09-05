/**
 * Payments placeholder for Lemon Squeezy or Dodo.
 * $9/month Laine paid plan.
 *
 * Nigeria founder → US clients: use a Merchant of Record
 * so you do not handle US tax/VAT yourself.
 */

export const PAID_PLAN = {
  name: "Laine Maker",
  priceUsd: 9,
  interval: "month" as const,
  features: [
    "Unlimited stash & projects",
    "Full Guide insights",
    "Circles (private groups)",
    "FO feed participation",
    "Cloud sync across devices",
  ],
};

export const FREE_LIMITS = {
  maxYarns: 40,
  maxProjects: 10,
  guideBasic: true,
  circles: false,
  cloudSync: false,
};

/** Set when you create a Lemon Squeezy or Dodo product */
export function getCheckoutUrl() {
  return (
    process.env.NEXT_PUBLIC_CHECKOUT_URL ||
    "" // e.g. https://laine.lemonsqueezy.com/checkout/buy/...
  );
}

export function isPaidConfigured() {
  return Boolean(getCheckoutUrl());
}
