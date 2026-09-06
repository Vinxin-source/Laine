"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCircle } from "@/lib/circles/storage";
import type { CirclePurpose } from "@/types/circles";
import { PURPOSE_LABELS } from "@/types/circles";
import { getIsPaidLocal } from "@/lib/billing/entitlements";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UpgradeCard } from "@/components/billing/UpgradeCard";

const purposes = (Object.keys(PURPOSE_LABELS) as CirclePurpose[]).map((value) => ({
  value,
  label: PURPOSE_LABELS[value],
}));

export function CreateCircleForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [paid, setPaid] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPaid(getIsPaidLocal());
    setReady(true);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!getIsPaidLocal()) return;
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const circle = createCircle({
      name: String(form.get("name") || ""),
      description: String(form.get("description") || "") || undefined,
      purpose: String(form.get("purpose") || "finish_club") as CirclePurpose,
    });
    router.push(`/circles/${circle.id}`);
  }

  if (!ready) {
    return <p className="text-sm text-[var(--text-secondary)]">Loading…</p>;
  }

  if (!paid) {
    return (
      <div className="space-y-4 max-w-lg">
        <Card padding="md">
          <h2 className="font-medium">Creating a Circle is a Maker feature</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Paid create keeps rooms intentional and blocks spam Circles. You can still join any
            Circle for free with an invite code.
          </p>
        </Card>
        <UpgradeCard />
      </div>
    );
  }

  return (
    <Card padding="lg" className="max-w-xl">
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input name="name" label="Circle name" placeholder="e.g. Thursday finish club" required />
        <Select name="purpose" label="Purpose" options={purposes} defaultValue="finish_club" />
        <Input
          name="description"
          label="Short description"
          placeholder="What is this room for?"
        />
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-3 text-xs text-[var(--text-secondary)] space-y-1">
          <p className="font-medium text-[var(--text-primary)]">Default safety rules</p>
          <p>No politics. No paid-pattern piracy. FO sharing is opt-in. Max 30 members.</p>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create Circle"}
          </Button>
          <Link href="/circles">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  );
}
