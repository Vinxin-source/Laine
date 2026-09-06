import type { Project, Yarn } from "@/types";

export type InsightKind =
  | "stash_summary"
  | "shop_stash"
  | "wip_nudge"
  | "finish_momentum"
  | "duplicate_risk"
  | "weight_gap"
  | "empty_start";

export interface Insight {
  id: string;
  kind: InsightKind;
  title: string;
  body: string;
  priority: number; // higher = show first
  actionHref?: string;
  actionLabel?: string;
}

export interface StashContext {
  yarnCount: number;
  projectCount: number;
  wipCount: number;
  finishedCount: number;
  plannedCount: number;
  totalSkeins: number;
  byWeight: Record<string, number>;
  yarns: Yarn[];
  projects: Project[];
}

export interface GuideMessage {
  id: string;
  role: "user" | "guide";
  content: string;
  createdAt: string;
}
