"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project } from "@/types";
import { deleteProject, getProjects } from "@/lib/storage";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [ready, setReady] = useState(false);

  function refresh() {
    setProjects(getProjects());
  }

  useEffect(() => {
    refresh();
    setReady(true);
  }, []);

  function handleDelete(id: string) {
    if (!confirm("Remove this project?")) return;
    deleteProject(id);
    refresh();
  }

  if (!ready) {
    return <p className="text-sm text-[var(--text-secondary)] animate-fade-in">Loading projects…</p>;
  }

  if (projects.length === 0) {
    return (
      <Card className="text-center py-16 animate-fade-up">
        <p className="text-[var(--text-secondary)] mb-4">
          No projects yet. Start one when you are ready — no rush.
        </p>
        <Link href="/projects/new">
          <Button variant="secondary">Create your first project</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((project, i) => (
        <div key={project.id} className={`stagger-${Math.min(4, i + 1)}`}>
          <ProjectCard project={project} onDelete={handleDelete} onChange={refresh} />
        </div>
      ))}
    </div>
  );
}
