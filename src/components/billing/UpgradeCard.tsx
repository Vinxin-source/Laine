"use client";

import { PLAN, PAID_FEATURES, FREE_FEATURES, getCheckoutUrl } from "@/lib/billing/config";
import { getIsPaidLocal, setIsPaidLocal } from "@/lib/billing/entitlements";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

export function UpgradeCard({ compact = false }: { compact?: boolean }) {
  const [paid, setPaid] = useState(false);
  const checkout = getCheckoutUrl();

  useEffect(() => {
    setPaid(getIsPaidLocal());
  }, []);

  function simulatePaid() {
    // Dev/test only until real checkout webhook exists
    setIsPaidLocal(true);
    setPaid(true);
  }

  if (paid) {
    return (
      <Card padding="md" className="border-[var(--primary)]/30">
        <p className="text-sm font-medium text-[var(--primary)]">Maker plan active</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Thank you — you can create Circles and use paid features on this device.
        </p>
      </Card>
    );
  }

  return (
    <Card padding={compact ? "md" : "lg"} className="max-w-lg">
      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Upgrade</p>
      <h2 className="text-xl font-serif mt-1">
        {PLAN.name} · ${PLAN.priceUsd}/{PLAN.interval}
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mt-2">{PLAN.tagline}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <p className="font-medium mb-1">Free</p>
          <ul className="text-[var(--text-secondary)] space-y-1 text-xs">
            {FREE_FEATURES.map((f) => (
              <li key={f}>· {f}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium mb-1">Maker ${PLAN.priceUsd}/mo</p>
          <ul className="text-[var(--text-secondary)] space-y-1 text-xs">
            {PAID_FEATURES.map((f) => (
              <li key={f}>· {f}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {checkout ? (
          <a href={checkout} target="_blank" rel="noreferrer">
            <Button>Upgrade · ${PLAN.priceUsd}/mo</Button>
          </a>
        ) : (
          <Button type="button" onClick={simulatePaid}>
            Test upgrade (dev)
          </Button>
        )}
      </div>
      <p className="mt-3 text-xs text-[var(--text-secondary)]">
        Payments via Merchant of Record (Lemon Squeezy or Dodo) so US/EU checkout works while
        you operate from Nigeria. Real checkout link goes in NEXT_PUBLIC_CHECKOUT_URL.
      </p>
    </Card>
  );
}
