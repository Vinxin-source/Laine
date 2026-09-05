import type { Yarn, YarnWeight } from "@/types";
import type { CircleMember } from "@/types/circles";
import { getYarns } from "@/lib/storage";

/**
 * Stash match — "Who in this Circle might have yarn that fits?"
 * Privacy: only compares weights/brands the member has chosen to make matchable.
 * In local demo, current user yarns are used as the searchable pool labeled by member.
 */

export interface MatchQuery {
  weight?: YarnWeight | "any";
  brand?: string;
  fiberKeyword?: string;
  minQuantity?: number;
}

export interface StashMatchResult {
  member: CircleMember;
  yarns: Yarn[];
  reason: string;
}

export function matchYarnsInPool(
  yarns: Yarn[],
  query: MatchQuery
): Yarn[] {
  const brand = (query.brand || "").trim().toLowerCase();
  const fiber = (query.fiberKeyword || "").trim().toLowerCase();
  const minQ = query.minQuantity ?? 0;

  return yarns.filter((y) => {
    if (query.weight && query.weight !== "any" && y.weight !== query.weight) {
      return false;
    }
    if (brand && !(y.brand || "").toLowerCase().includes(brand)) return false;
    if (fiber && !(y.fiber || "").toLowerCase().includes(fiber)) return false;
    if (y.quantity < minQ) return false;
    return true;
  });
}

/**
 * Local prototype: treats the device stash as visible to the circle for matching demos.
 * Production: each member opts in a "matchable stash" subset stored server-side.
 */
export function findCircleStashMatches(
  members: CircleMember[],
  query: MatchQuery
): StashMatchResult[] {
  const pool = getYarns();
  const hits = matchYarnsInPool(pool, query);
  if (!hits.length) return [];

  // Demo: attribute matches to local user member if present, else first member
  const self =
    members.find((m) => m.userId === "local") || members[0];
  if (!self) return [];

  const reasonParts: string[] = [];
  if (query.weight && query.weight !== "any") reasonParts.push(query.weight);
  if (query.brand) reasonParts.push(query.brand);
  if (query.fiberKeyword) reasonParts.push(query.fiberKeyword);

  return [
    {
      member: self,
      yarns: hits.slice(0, 12),
      reason: reasonParts.length
        ? `Matches: ${reasonParts.join(" · ")}`
        : "Matches your filters",
    },
  ];
}
