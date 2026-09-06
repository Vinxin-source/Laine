"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Yarn } from "@/types";
import { listYarns, removeYarn } from "@/lib/yarn-repo";
import { YarnCard } from "@/components/yarn/YarnCard";
import { StashToolbar } from "@/components/yarn/StashToolbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function StashList() {
  const [yarns, setYarns] = useState<Yarn[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [weight, setWeight] = useState("all");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const data = await listYarns();
      setYarns(data);
      setError("");
    } catch {
      setError("Could not load stash.");
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return yarns.filter((y) => {
      const matchesWeight = weight === "all" || y.weight === weight;
      if (!matchesWeight) return false;
      if (!q) return true;
      const haystack = [y.name, y.brand, y.colorway, y.fiber, y.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [yarns, query, weight]);

  async function handleDelete(id: string) {
    if (!confirm("Remove this yarn from your stash?")) return;
    await removeYarn(id);
    await refresh();
  }

  if (!ready) {
    return (
      <p className="text-sm text-[var(--text-secondary)] animate-fade-in">Loading stash…</p>
    );
  }

  if (error) {
    return <p className="text-sm text-[var(--danger)]">{error}</p>;
  }

  if (yarns.length === 0) {
    return (
      <Card className="text-center py-16 animate-fade-up">
        <p className="text-[var(--text-secondary)] mb-4">
          Your stash is empty. Add your first skein to begin.
        </p>
        <Link href="/stash/new">
          <Button variant="secondary">Add your first yarn</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div>
      <StashToolbar
        query={query}
        weight={weight}
        onQueryChange={setQuery}
        onWeightChange={setWeight}
      />

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-[var(--text-secondary)]">No yarn matches that search.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((yarn) => (
            <YarnCard key={yarn.id} yarn={yarn} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
