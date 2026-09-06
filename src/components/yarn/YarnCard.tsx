"use client";

import Link from "next/link";
import type { Yarn } from "@/types";
import { Button } from "@/components/ui/Button";

export function YarnCard({
  yarn,
  onDelete,
}: {
  yarn: Yarn;
  onDelete?: (id: string) => void;
}) {
  return (
    <article className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-fade-up">
      <div className="aspect-[4/3] bg-[var(--primary-soft)] flex items-center justify-center text-[var(--text-secondary)] text-sm transition-colors">
        {yarn.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={yarn.photoUrl} alt={yarn.name} className="w-full h-full object-cover" />
        ) : (
          <span>{yarn.colorway || yarn.name}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-[var(--text-primary)] truncate">{yarn.name}</h3>
        <p className="text-sm text-[var(--text-secondary)] truncate">
          {[yarn.brand, yarn.colorway].filter(Boolean).join(" · ") || "—"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
          <span className="px-2 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
            {yarn.weight}
          </span>
          <span className="px-2 py-1 rounded-full border border-[var(--border)]">
            ×{yarn.quantity}
          </span>
          {yarn.location ? (
            <span className="px-2 py-1 rounded-full border border-[var(--border)] truncate max-w-[140px]">
              {yarn.location}
            </span>
          ) : null}
        </div>
        <div className="mt-4 flex gap-2">
          <Link href={`/stash/${yarn.id}/edit`}>
            <Button variant="secondary" size="sm" type="button">
              Edit
            </Button>
          </Link>
          {onDelete ? (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => onDelete(yarn.id)}
            >
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
