import type { Project, Yarn } from "@/types";
import type { StashContext } from "@/lib/ai/types";

export function buildStashContext(yarns: Yarn[], projects: Project[]): StashContext {
  const byWeight: Record<string, number> = {};
  let totalSkeins = 0;

  for (const y of yarns) {
    byWeight[y.weight] = (byWeight[y.weight] || 0) + y.quantity;
    totalSkeins += y.quantity;
  }

  return {
    yarnCount: yarns.length,
    projectCount: projects.length,
    wipCount: projects.filter((p) => p.status === "wip").length,
    finishedCount: projects.filter((p) => p.status === "finished").length,
    plannedCount: projects.filter((p) => p.status === "planned").length,
    totalSkeins,
    byWeight,
    yarns,
    projects,
  };
}

/** Compact text block for optional LLM — only facts from user data */
export function contextToPromptBlock(ctx: StashContext): string {
  const weightLines = Object.entries(ctx.byWeight)
    .sort((a, b) => b[1] - a[1])
    .map(([w, q]) => `  - ${w}: ${q} skeins`)
    .join("\n");

  const yarnLines = ctx.yarns
    .slice(0, 40)
    .map((y) => {
      const bits = [y.name, y.brand, y.colorway, y.weight, `×${y.quantity}`];
      if (y.location) bits.push(`@ ${y.location}`);
      return `  - ${bits.filter(Boolean).join(" · ")}`;
    })
    .join("\n");

  const projectLines = ctx.projects
    .slice(0, 20)
    .map((p) => `  - ${p.name} [${p.status}] ${p.progress}%${p.patternName ? ` · ${p.patternName}` : ""}`)
    .join("\n");

  return `USER STASH FACTS (do not invent beyond this):
Yarn entries: ${ctx.yarnCount}
Total skeins (approx): ${ctx.totalSkeins}
By weight:
${weightLines || "  (none)"}
Yarns:
${yarnLines || "  (empty)"}
Projects:
${projectLines || "  (none)"}
WIP count: ${ctx.wipCount}
Finished count: ${ctx.finishedCount}
Planned count: ${ctx.plannedCount}`;
}

export const GUIDE_SYSTEM_PROMPT = `You are Laine Guide, a calm personal assistant for a knitter/crocheter inside the Laine app.

Rules:
- Only use facts from USER STASH FACTS. If unknown, say you do not have that in their stash data.
- Never invent yarn, brands, quantities, or locations.
- Never write full knitting or crochet patterns.
- Prefer using yarn they already own over suggesting purchases.
- Be concise, practical, and kind. No hype, no shame about unfinished work.
- If they ask for a pattern, help them think about weight/yardage from stash and point them to trusted human designers — do not generate a pattern.
- If data is empty, invite them to add a few skeins or a WIP.`;
