"use client";

import { useEffect, useState } from "react";
import type { FinishChallenge } from "@/types/circles";
import { ensureMonthlyChallenge, joinChallenge } from "@/lib/circles/challenges";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function FinishChallengeCard({ circleId }: { circleId: string }) {
  const [challenge, setChallenge] = useState<FinishChallenge | null>(null);

  useEffect(() => {
    setChallenge(ensureMonthlyChallenge(circleId));
  }, [circleId]);

  if (!challenge) return null;

  const joined = challenge.participantIds.includes("local");

  return (
    <Card padding="md" className="max-w-xl border-[var(--primary)]/20">
      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
        This month · optional
      </p>
      <h3 className="font-medium mt-1">{challenge.title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mt-2">
        Light accountability: aim for {challenge.targetFinishes} finished object
        {challenge.targetFinishes === 1 ? "" : "s"} this month. No shame if life gets in the
        way — celebrate what you do finish inside the Circle.
      </p>
      <p className="text-xs text-[var(--text-secondary)] mt-2">
        {challenge.participantIds.length} maker
        {challenge.participantIds.length === 1 ? "" : "s"} in on this challenge
      </p>
      <div className="mt-3">
        {joined ? (
          <p className="text-sm text-[var(--primary)]">You are in · go gentle</p>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={() => setChallenge(joinChallenge(circleId))}
          >
            Join this month
          </Button>
        )}
      </div>
    </Card>
  );
}
