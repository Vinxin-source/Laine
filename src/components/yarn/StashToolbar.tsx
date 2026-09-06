"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const weightOptions = [
  { value: "all", label: "All weights" },
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

export function StashToolbar({
  query,
  weight,
  onQueryChange,
  onWeightChange,
}: {
  query: string;
  weight: string;
  onQueryChange: (value: string) => void;
  onWeightChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3 mb-6">
      <Input
        label="Search stash"
        placeholder="Name, brand, colorway, location…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <Select
        label="Weight"
        options={weightOptions}
        value={weight}
        onChange={(e) => onWeightChange(e.target.value)}
      />
    </div>
  );
}
