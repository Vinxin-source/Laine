import type { StashContext, Insight } from "@/lib/ai/types";

/**
 * Deterministic personalisation — runs fully offline, $0 API cost.
 * This is the core of Laine Guide for free users.
 */
export function generateInsights(ctx: StashContext): Insight[] {
  const insights: Insight[] = [];

  if (ctx.yarnCount === 0 && ctx.projectCount === 0) {
    insights.push({
      id: "empty",
      kind: "empty_start",
      title: "Start with what you already own",
      body: "Add a few skeins from one bin or bag. Laine Guide gets useful the moment your real stash is in here — not before.",
      priority: 100,
      actionHref: "/stash/new",
      actionLabel: "Add first yarn",
    });
    return insights;
  }

  if (ctx.yarnCount > 0) {
    const topWeights = Object.entries(ctx.byWeight)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([w, q]) => `${q}× ${w}`)
      .join(", ");

    insights.push({
      id: "summary",
      kind: "stash_summary",
      title: "Your stash at a glance",
      body: `${ctx.yarnCount} yarn ${ctx.yarnCount === 1 ? "entry" : "entries"} · about ${Math.round(ctx.totalSkeins)} skeins. Most stocked: ${topWeights || "—"}.`,
      priority: 90,
      actionHref: "/stash",
      actionLabel: "Open stash",
    });
  }

  // Shop your stash: planned projects that share a weight with owned yarn
  const planned = ctx.projects.filter((p) => p.status === "planned");
  if (planned.length && ctx.yarns.length) {
    const weightsOwned = new Set(ctx.yarns.map((y) => y.weight));
    insights.push({
      id: "shop-stash",
      kind: "shop_stash",
      title: "Shop your stash before you buy",
      body: `You have ${planned.length} planned ${planned.length === 1 ? "project" : "projects"} and yarn in ${weightsOwned.size} weight ${weightsOwned.size === 1 ? "category" : "categories"}. Match a plan to a weight you already own — buying can wait.`,
      priority: 80,
      actionHref: "/projects",
      actionLabel: "View plans",
    });
  }

  // WIP nudge — gentle, not shaming
  if (ctx.wipCount === 1) {
    const wip = ctx.projects.find((p) => p.status === "wip");
    insights.push({
      id: "wip-one",
      kind: "wip_nudge",
      title: "One project in progress",
      body: wip
        ? `“${wip.name}” is at ${wip.progress}%. A short session this week keeps momentum without pressure.`
        : "You have one WIP. A short session keeps momentum.",
      priority: 70,
      actionHref: "/projects",
      actionLabel: "See projects",
    });
  } else if (ctx.wipCount >= 2) {
    insights.push({
      id: "wip-many",
      kind: "wip_nudge",
      title: `${ctx.wipCount} works in progress`,
      body: "Several WIPs is normal. Pick one for a finish focus this month — the others can rest without guilt.",
      priority: 75,
      actionHref: "/projects",
      actionLabel: "Choose a focus",
    });
  }

  if (ctx.finishedCount > 0) {
    insights.push({
      id: "finished",
      kind: "finish_momentum",
      title: "Finished objects count",
      body: `${ctx.finishedCount} finished ${ctx.finishedCount === 1 ? "project" : "projects"} on record. That is real progress — not just yarn collected.`,
      priority: 40,
    });
  }

  // Duplicate / concentration risk
  const brandCounts: Record<string, number> = {};
  for (const y of ctx.yarns) {
    const key = `${(y.brand || "").toLowerCase()}|${(y.colorway || y.name).toLowerCase()}`;
    brandCounts[key] = (brandCounts[key] || 0) + 1;
  }
  const dupes = Object.values(brandCounts).filter((c) => c > 1).length;
  if (dupes > 0) {
    insights.push({
      id: "dupes",
      kind: "duplicate_risk",
      title: "Possible repeats in stash",
      body: `Laine spotted ${dupes} possible duplicate name/brand groups. Worth a quick check before the next order.`,
      priority: 55,
      actionHref: "/stash",
      actionLabel: "Review stash",
    });
  }

  // Single-weight heavy stash
  const weights = Object.keys(ctx.byWeight);
  if (weights.length === 1 && ctx.totalSkeins >= 5) {
    insights.push({
      id: "weight-focus",
      kind: "weight_gap",
      title: `Mostly ${weights[0]} so far`,
      body: `Your logged stash is concentrated in ${weights[0]}. That is fine — just useful to know when a pattern calls for another weight.`,
      priority: 35,
    });
  }

  return insights.sort((a, b) => b.priority - a.priority);
}

/** Simple offline Q&A from user data — no API */
export function answerFromStash(question: string, ctx: StashContext): string {
  const q = question.toLowerCase().trim();

  if (!q) return "Ask about your stash, WIPs, or what weights you own.";

  if (ctx.yarnCount === 0) {
    return "Your stash is empty in Laine right now. Add a few skeins and I can answer from your real data.";
  }

  if (q.includes("how many") && (q.includes("yarn") || q.includes("skein") || q.includes("stash"))) {
    return `You have ${ctx.yarnCount} yarn ${ctx.yarnCount === 1 ? "entry" : "entries"} and about ${Math.round(ctx.totalSkeins)} skeins logged.`;
  }

  if (q.includes("wip") || q.includes("in progress")) {
    if (ctx.wipCount === 0) return "You have no projects marked WIP right now.";
    const names = ctx.projects
      .filter((p) => p.status === "wip")
      .map((p) => `“${p.name}” (${p.progress}%)`)
      .join(", ");
    return `You have ${ctx.wipCount} WIP(s): ${names}.`;
  }

  if (q.includes("finished") || q.includes("fo ")) {
    return ctx.finishedCount
      ? `You have ${ctx.finishedCount} finished project(s) recorded.`
      : "No finished projects recorded yet.";
  }

  // Weight questions
  for (const weight of Object.keys(ctx.byWeight)) {
    if (q.includes(weight)) {
      const yarns = ctx.yarns.filter((y) => y.weight === weight);
      const list = yarns
        .slice(0, 8)
        .map((y) => `${y.name}${y.brand ? ` (${y.brand})` : ""} ×${y.quantity}`)
        .join("; ");
      return `You have about ${ctx.byWeight[weight]} skeins of ${weight}: ${list}${yarns.length > 8 ? "…" : ""}`;
    }
  }

  if (q.includes("where") || q.includes("location")) {
    const withLoc = ctx.yarns.filter((y) => y.location);
    if (!withLoc.length) return "No storage locations logged yet. Add a location when you edit a yarn.";
    const sample = withLoc
      .slice(0, 6)
      .map((y) => `${y.name} → ${y.location}`)
      .join("; ");
    return `Locations I know: ${sample}`;
  }

  if (q.includes("buy") || q.includes("purchase") || q.includes("shop")) {
    return "Before buying more, check your stash weights and planned projects in Laine. I will not push purchases — shop your stash first.";
  }

  if (q.includes("pattern")) {
    return "I do not generate patterns. Use your stash weights and yardage to choose a human-designed pattern you trust. If you tell me a weight, I can list what you own in that weight.";
  }

  // Brand search
  const brandHit = ctx.yarns.find(
    (y) => y.brand && q.includes(y.brand.toLowerCase())
  );
  if (brandHit?.brand) {
    const same = ctx.yarns.filter(
      (y) => (y.brand || "").toLowerCase() === brandHit.brand!.toLowerCase()
    );
    return `You have ${same.length} ${brandHit.brand} ${same.length === 1 ? "entry" : "entries"}: ${same
      .map((y) => `${y.name}${y.colorway ? ` / ${y.colorway}` : ""}`)
      .join("; ")}`;
  }

  return "I can answer from your logged stash and projects — try: “How many WIPs?”, “What DK do I own?”, or “Where is my yarn?”. For richer chat across devices, cloud + paid Guide can use a language model on top of this same data.";
}
