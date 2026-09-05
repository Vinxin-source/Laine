import type { Yarn, Project } from "@/types";

const YARNS_KEY = "laine_yarns";
const PROJECTS_KEY = "laine_projects";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getYarns(): Yarn[] {
  return read<Yarn>(YARNS_KEY);
}

export function getYarn(id: string): Yarn | undefined {
  return getYarns().find((y) => y.id === id);
}

export function saveYarn(
  yarn: Omit<Yarn, "id" | "userId" | "createdAt" | "updatedAt">
): Yarn {
  const yarns = getYarns();
  const now = new Date().toISOString();
  const next: Yarn = {
    ...yarn,
    id: crypto.randomUUID(),
    userId: "local",
    createdAt: now,
    updatedAt: now,
  };
  yarns.unshift(next);
  write(YARNS_KEY, yarns);
  return next;
}

export function updateYarn(
  id: string,
  patch: Partial<Omit<Yarn, "id" | "userId" | "createdAt">>
): Yarn | null {
  const yarns = getYarns();
  const index = yarns.findIndex((y) => y.id === id);
  if (index < 0) return null;
  const updated: Yarn = {
    ...yarns[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  yarns[index] = updated;
  write(YARNS_KEY, yarns);
  return updated;
}

export function deleteYarn(id: string) {
  write(
    YARNS_KEY,
    getYarns().filter((y) => y.id !== id)
  );
}

/** Simple match: same brand + colorway, or same name */
export function findSimilarYarns(input: {
  name: string;
  brand?: string;
  colorway?: string;
}): Yarn[] {
  const name = input.name.trim().toLowerCase();
  const brand = (input.brand || "").trim().toLowerCase();
  const colorway = (input.colorway || "").trim().toLowerCase();

  return getYarns().filter((y) => {
    const yName = y.name.toLowerCase();
    const yBrand = (y.brand || "").toLowerCase();
    const yColor = (y.colorway || "").toLowerCase();

    if (brand && colorway && yBrand === brand && yColor === colorway) return true;
    if (name && yName === name) return true;
    if (brand && name && yBrand === brand && yName === name) return true;
    return false;
  });
}

export function getProjects(): Project[] {
  return read<Project>(PROJECTS_KEY);
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function saveProject(
  project: Omit<Project, "id" | "userId" | "createdAt" | "updatedAt" | "yarnIds"> & {
    yarnIds?: string[];
  }
): Project {
  const projects = getProjects();
  const now = new Date().toISOString();
  const next: Project = {
    ...project,
    id: crypto.randomUUID(),
    userId: "local",
    yarnIds: project.yarnIds ?? [],
    createdAt: now,
    updatedAt: now,
  };
  projects.unshift(next);
  write(PROJECTS_KEY, projects);
  return next;
}

export function updateProject(
  id: string,
  patch: Partial<Omit<Project, "id" | "userId" | "createdAt">>
): Project | null {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index < 0) return null;
  const updated: Project = {
    ...projects[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  projects[index] = updated;
  write(PROJECTS_KEY, projects);
  return updated;
}

export function deleteProject(id: string) {
  write(
    PROJECTS_KEY,
    getProjects().filter((p) => p.id !== id)
  );
}
