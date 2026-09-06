"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Circle } from "@/types/circles";
import { listCircles, joinCircleByCode } from "@/lib/circles/storage";
import { CircleCard } from "@/components/circles/CircleCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function CirclesHome() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCircles(listCircles());
    setReady(true);
  }, []);

  function refresh() {
    setCircles(listCircles());
  }

  function onJoin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = joinCircleByCode(code);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCode("");
    refresh();
  }

  if (!ready) {
    return <p className="text-sm text-[var(--text-secondary)]">Loading circles…</p>;
  }

  return (
    <div className="space-y-8">
      <Card padding="md" className="bg-[var(--primary-soft)]/40 border-[var(--border)]">
        <h2 className="font-medium text-[var(--text-primary)]">What Circles are</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          Small rooms of 5–30 makers. Invite only. No public discovery feed. Built for trust —
          finish support, FO sharing, and stash help — not Facebook-scale noise, scams, or
          pattern theft.
        </p>
        <ul className="mt-3 text-sm text-[var(--text-secondary)] space-y-1 list-disc pl-5">
          <li>Hard cap 30 members (conversation stays human)</li>
          <li>Create Circle on the $9 plan (stops spam circles)</li>
          <li>Anyone with an invite can join</li>
          <li>FO posts are opt-in; soft finish status stays inside the Circle</li>
        </ul>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
        <form onSubmit={onJoin} className="flex flex-col sm:flex-row gap-2 flex-1 max-w-lg">
          <div className="flex-1">
            <Input
              label="Have an invite code?"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. A1B2C3"
            />
          </div>
          <Button type="submit" className="sm:mb-0.5">
            Join Circle
          </Button>
        </form>
        <Link href="/circles/new">
          <Button variant="secondary">Create Circle</Button>
        </Link>
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      {circles.length === 0 ? (
        <Card className="text-center py-14">
          <p className="text-[var(--text-secondary)] mb-4 max-w-md mx-auto">
            You are not in a Circle yet. Create one for a small finish club, or join with a
            code from someone you trust.
          </p>
          <Link href="/circles/new">
            <Button>Create your first Circle</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {circles.map((c) => (
            <CircleCard key={c.id} circle={c} />
          ))}
        </div>
      )}
    </div>
  );
}
