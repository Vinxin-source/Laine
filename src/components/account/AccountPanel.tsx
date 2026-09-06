"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSessionUser, signOut, isCloudEnabled } from "@/lib/auth";
import { getIsPaidLocal, setIsPaidLocal } from "@/lib/billing/entitlements";
import { PLAN } from "@/lib/billing/config";
import { UpgradeCard } from "@/components/billing/UpgradeCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function AccountPanel() {
  const [email, setEmail] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [cloud, setCloud] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCloud(isCloudEnabled());
    setPaid(getIsPaidLocal());
    getSessionUser().then((u) => {
      setEmail(u?.email ?? null);
      setReady(true);
    });
  }, []);

  async function onLogout() {
    await signOut();
    setEmail(null);
  }

  function clearPaidDev() {
    setIsPaidLocal(false);
    setPaid(false);
  }

  if (!ready) {
    return <p className="text-sm text-[var(--text-secondary)]">Loading account…</p>;
  }

  return (
    <div className="space-y-6 max-w-lg animate-fade-up">
      <Card padding="md">
        <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Account</p>
        <p className="mt-2 font-medium">{email || "Not signed in"}</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {cloud
            ? "Cloud mode available — sign in to sync across devices."
            : "Offline device mode — data stays in this browser until Supabase keys are added."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {email ? (
            <Button variant="secondary" size="sm" type="button" onClick={onLogout}>
              Log out
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary" size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </Card>

      <Card padding="md">
        <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Plan</p>
        <p className="mt-2 font-medium">
          {paid ? `${PLAN.name} · active` : "Free"}
        </p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {paid
            ? "You can create Circles and use Maker features on this device."
            : `Upgrade to ${PLAN.name} ($${PLAN.priceUsd}/mo) to create Circles.`}
        </p>
        {paid ? (
          <Button variant="ghost" size="sm" type="button" className="mt-3" onClick={clearPaidDev}>
            Clear test upgrade (dev)
          </Button>
        ) : null}
      </Card>

      {!paid ? <UpgradeCard /> : null}

      <p className="text-xs text-[var(--text-secondary)]">
        <Link href="/privacy" className="underline-offset-2 hover:underline">
          Privacy
        </Link>
        {" · "}
        <Link href="/terms" className="underline-offset-2 hover:underline">
          Terms
        </Link>
        {" · "}
        <Link href="/pricing" className="underline-offset-2 hover:underline">
          Pricing
        </Link>
      </p>
    </div>
  );
}
