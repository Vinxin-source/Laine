"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getYarns, saveProject } from "@/lib/storage";
import type { ProjectStatus, Yarn } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const statuses = [
  { value: "planned", label: "Planned" },
  { value: "wip", label: "Work in progress" },
  { value: "finished", label: "Finished" },
  { value: "frogged", label: "Frogged" },
];

export function AddProjectForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [yarns, setYarns] = useState<Yarn[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setYarns(getYarns());
  }, []);

  function toggleYarn(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    saveProject({
      name: String(form.get("name") || "").trim(),
      status: String(form.get("status") || "planned") as ProjectStatus,
      progress: Number(form.get("progress") || 0),
      patternName: String(form.get("patternName") || "").trim() || undefined,
      patternUrl: String(form.get("patternUrl") || "").trim() || undefined,
      notes: String(form.get("notes") || "").trim() || undefined,
      yarnIds: selected,
    });

    router.push("/projects");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Input name="name" label="Project name" placeholder="e.g. Forest cardigan" required />
      <Select name="status" label="Status" options={statuses} defaultValue="planned" />
      <Input name="patternName" label="Pattern name" placeholder="Optional" />
      <Input name="patternUrl" label="Pattern link" type="url" placeholder="https://" />
      <Input
        name="progress"
        label="Progress %"
        type="number"
        min={0}
        max={100}
        defaultValue="0"
      />
      <Input name="notes" label="Notes" placeholder="Need 2 more skeins of Sunday" />

      <div>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
          Yarn from your stash
        </p>
        {yarns.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">
            No yarn logged yet.{" "}
            <Link href="/stash/new" className="text-[var(--primary)]">
              Add yarn
            </Link>{" "}
            first for better Guide suggestions.
          </p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-auto rounded-[var(--radius-md)] border border-[var(--border)] p-2">
            {yarns.map((y) => {
              const on = selected.includes(y.id);
              return (
                <li key={y.id}>
                  <button
                    type="button"
                    onClick={() => toggleYarn(y.id)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-[var(--radius-sm)] border ${
                      on
                        ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "border-transparent hover:bg-[var(--background)]"
                    }`}
                  >
                    {y.name}
                    {y.brand ? ` · ${y.brand}` : ""}
                    {y.colorway ? ` · ${y.colorway}` : ""}
                    <span className="text-[var(--text-secondary)]"> · {y.weight}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {selected.length > 0 ? (
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            {selected.length} yarn linked — Guide will treat these as in-use.
          </p>
        ) : null}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save project"}
        </Button>
        <Link href="/projects">
          <Button variant="ghost" type="button">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
