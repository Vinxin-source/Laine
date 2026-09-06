"use client";

const PAID_KEY = "laine_is_paid";

/**
 * Local entitlement flag until Lemon Squeezy / Dodo webhooks are connected.
 * In production, isPaid comes from Supabase profiles.is_paid after webhook.
 */
export function getIsPaidLocal(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PAID_KEY) === "1";
}

export function setIsPaidLocal(value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PAID_KEY, value ? "1" : "0");
}

export function canCreateCircle(isPaid: boolean): boolean {
  return isPaid;
}
