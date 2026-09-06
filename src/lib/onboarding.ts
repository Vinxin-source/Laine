"use client";

const KEY = "laine_onboarding_done";

export function isOnboardingDone(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(KEY) === "1";
}

export function completeOnboarding() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, "1");
}
