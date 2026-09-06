"use client";

import { FormEvent, useMemo, useState } from "react";
import type { CircleMember } from "@/types/circles";
import type { YarnWeight } from "@/types";
import { findCircleStashMatches } from "@/lib/circles/stash-match";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const weights = [
  { value: "any", label: "Any weight" },
  { value: "lace", label: "Lace" },
  { value: "fingering", label: "Fingering" },
  { value: "sport", label: "Sport" },
  { value: "dk", label: "DK" },
  { value: "worsted", label: "Worsted" },
  { value: "aran", label: "Aran" },
  { value: "bulky", label: "Bulky" },
  { value: "super-bulky", label: "Super bulky" },
  { value: "jumbo", label: "Jumbo" },
];

export function StashMatchPanel({ members }: { members: CircleMember[] }) {
  const [weight, setWeight] = useState("any");
  const [brand, setBrand] = useState("");
  const [fiber, setFiber] = useState("");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!searched) return [];
    return findCircleStashMatches(members, {
      weight: weight as YarnWeight | "any",
      brand: brand || undefined,
      fiberKeyword: fiber || undefined,
    });
  }, [searched, weight, brand, fiber, members]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setSearched(true);
  }

  return (
    <section>
      <h2 className="text-lg font-medium mb-1">Stash match</h2>
      <p className="text-xs text-[var(--text-secondary)] mb-3 max-w-xl">
        Ask who in this Circle might have yarn that fits — weight, brand, fiber. In production
        each member opts in what is matchable. Never a global public stash search.
      </p>

      <Card padding="md" className="max-w-xl mb-4">
        <form className="space-y-3" onSubmit={onSearch}>
          <Select
            label="Weight"
            options={weights}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Input
            label="Brand (optional)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Sandnes"
          />
          <Input
            label="Fiber keyword (optional)"
            value={fiber}
            onChange={(e) => setFiber(e.target.value)}
            placeholder="e.g. merino"
          />
          <Button type="submit" size="sm">
            Search Circle stash
          </Button>
        </form>
      </Card>

      {searched && results.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          No matchable yarn for those filters in this demo pool.
        </p>
      ) : null}

      {results.map((r) => (
        <Card key={r.member.userId} padding="md" className="max-w-xl mb-3">
          <p className="text-sm font-medium">{r.member.displayName}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{r.reason}</p>
          <ul className="mt-3 space-y-1 text-sm text-[var(--text-secondary)]">
            {r.yarns.map((y) => (
              <li key={y.id}>
                {y.name}
                {y.brand ? ` · ${y.brand}` : ""}
                {y.colorway ? ` · ${y.colorway}` : ""} · {y.weight} · ×{y.quantity}
                {y.location ? ` · ${y.location}` : ""}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </section>
  );
}
