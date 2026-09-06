"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project, ProjectStatus } from "@/types";
import { getProject, updateProject } from "@/lib/storage";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const statuses = [
  { value: "planned", label: "Planned" },
  { value: "wip", label: "WIP" },
  { value: "finished", label: "Finished" },
  { value: "frogged", label: "Frogged" },
];

export function EditProjectForm({ id }: { id: string }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProject(getProject(id) ?? null);
  }, [id]);

  if (!project) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        Project not found.{" "}
        <Link href="/projects" className="text-[var(--primary)]">
          Back
        </Link>
      </p>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const status = String(form.get("status") || "planned") as ProjectStatus;
    const progress = Number(form.get("progress") || 0);
    updateProject(id, {
      name: String(form.get("name") || "").trim(),
      patternName: String(form.get("patternName") || "").trim() || undefined,
      status,
      progress: status === "finished" ? 100 : Math.min(100, Math.max(0, progress)),
      notes: String(form.get("notes") || "").trim() || undefined,
      finishedAt: status === "finished" ? new Date().toISOString() : project.finishedAt,
    });
    router.push("/projects");
    router.refresh();
  }

  return (
    <form className="space-y-4 animate-fade-up" onSubmit={onSubmit}>
      <Input name="name" label="Project name" defaultValue={project.name} required />
      <Input
        name="patternName"
        label="Pattern name"
        defaultValue={project.patternName || ""}
      />
      <Select
        name="status"
        label="Status"
        options={statuses}
        defaultValue={project.status}
      />
      <Input
        name="progress"
        label="Progress %"
        type="number"
        min={0}
        max={100}
        defaultValue={String(project.progress)}
      />
      <Input name="notes" label="Notes" defaultValue={project.notes || ""} />
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
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
