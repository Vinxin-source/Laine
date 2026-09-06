"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { completeOnboarding, isOnboardingDone } from "@/lib/onboarding";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const steps = [
  {
    title: "Your stash, calmly",
    body: "Log what you already own — weight, brand, where it lives. No pressure to catalogue everything in one night.",
  },
  {
    title: "Finish more of what you start",
    body: "Track WIPs with gentle progress. Laine Guide helps you shop your stash before buying more.",
  },
  {
    title: "Circles, not crowds",
    body: "Private rooms of up to 30 makers. Invite only. FO sharing and stash match stay inside the Circle.",
  },
];

export function OnboardingFlow() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setShow(!isOnboardingDone());
  }, []);

  if (!show) return null;

  const current = steps[step];
  const last = step === steps.length - 1;

  function next() {
    if (last) {
      completeOnboarding();
      setShow(false);
      return;
    }
    setStep((s) => s + 1);
  }

  function skip() {
    completeOnboarding();
    setShow(false);
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--background)]/95 backdrop-blur-sm flex items-center justify-center p-5">
      <Card padding="lg" className="w-full max-w-md">
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
          Welcome to Laine · {step + 1}/{steps.length}
        </p>
        <h2 className="text-2xl font-serif mt-2">{current.title}</h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          {current.body}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={next}>{last ? "Start using Laine" : "Next"}</Button>
          {!last ? (
            <Button variant="ghost" onClick={skip}>
              Skip
            </Button>
          ) : (
            <Link href="/stash/new">
              <Button variant="secondary" onClick={() => completeOnboarding()}>
                Add first yarn
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
