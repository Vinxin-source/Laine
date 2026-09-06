import Link from "next/link";
import type { Insight } from "@/lib/ai/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Card padding="md" className="h-full">
      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)] mb-1">
        Laine Guide
      </p>
      <h3 className="font-medium text-[var(--text-primary)]">{insight.title}</h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
        {insight.body}
      </p>
      {insight.actionHref && insight.actionLabel ? (
        <div className="mt-4">
          <Link href={insight.actionHref}>
            <Button variant="secondary" size="sm">
              {insight.actionLabel}
            </Button>
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
