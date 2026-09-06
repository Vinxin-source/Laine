"use client";

import Link from "next/link";
import type { Project } from "@/types";
import { updateProject } from "@/lib/storage";
import { Button } from "@/components/ui/Button";

const statusLabel: Record<Project["status"], string> = {
  planned: "Planned",
  wip: "WIP",
  finished: "Finished",
  frogged: "Frogged",
};

export function ProjectCard({
  project,
  onDelete,
  onChange,
}: {
  project: Project;
  onDelete?: (id: string) => void;
  onChange?: () => void;
}) {
  function markFinished() {
    updateProject(project.id, {
      status: "finished",
      progress: 100,
      finishedAt: new Date().toISOString(),
    });
    onChange?.();
  }

  return (
    <article className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-md animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[var(--text-primary)]">{project.name}</h3>
          {project.patternName ? (
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{project.patternName}</p>
          ) : null}
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] whitespace-nowrap">
          {statusLabel[project.status]}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/projects/${project.id}/edit`}>
          <Button variant="secondary" size="sm" type="button">
            Edit
          </Button>
        </Link>
        {project.status !== "finished" ? (
          <Button variant="ghost" size="sm" type="button" onClick={markFinished}>
            Mark finished
          </Button>
        ) : null}
        {onDelete ? (
          <Button variant="ghost" size="sm" type="button" onClick={() => onDelete(project.id)}>
            Remove
          </Button>
        ) : null}
      </div>
    </article>
  );
}
