// Laine core types

export type YarnWeight =
  | "lace"
  | "fingering"
  | "sport"
  | "dk"
  | "worsted"
  | "aran"
  | "bulky"
  | "super-bulky"
  | "jumbo";

export type ProjectStatus = "planned" | "wip" | "finished" | "frogged";

export interface Yarn {
  id: string;
  userId: string;
  name: string;
  brand?: string;
  colorway?: string;
  weight: YarnWeight;
  fiber?: string;
  quantity: number; // number of skeins/balls
  yardagePerSkein?: number;
  location?: string;
  photoUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  status: ProjectStatus;
  progress: number; // 0-100
  patternName?: string;
  patternUrl?: string;
  yarnIds: string[];
  photoUrl?: string;
  notes?: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Circle {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  isPrivate: boolean;
  memberCount: number;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  isPaid: boolean;
  createdAt: string;
}
