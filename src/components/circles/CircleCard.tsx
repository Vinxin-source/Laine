import Link from "next/link";
import type { Circle } from "@/types/circles";
import { PURPOSE_LABELS } from "@/types/circles";
import { Card } from "@/components/ui/Card";

export function CircleCard({ circle }: { circle: Circle }) {
  return (
    <Link href={`/circles/${circle.id}`}>
      <Card className="hover:border-[var(--primary)] transition-colors h-full">
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
          {PURPOSE_LABELS[circle.purpose]}
        </p>
        <h3 className="mt-1 font-medium text-[var(--text-primary)]">{circle.name}</h3>
        {circle.description ? (
          <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
            {circle.description}
          </p>
        ) : null}
        <p className="mt-4 text-xs text-[var(--text-secondary)]">
          {circle.memberCount}/{circle.maxMembers} members · Invite only
        </p>
      </Card>
    </Link>
  );
}
