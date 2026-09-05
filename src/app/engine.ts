/**
 * Laine Guide — personal intelligence for makers
 *
 * Design principles (from competitor research + maker pain points):
 * 1. Answers must use THIS user's stash & projects — never generic advice.
 * 2. Offline-first: works with zero API keys / zero money.
 * 3. Calm tone: no hype, no pressure, no "AI slop".
 * 4. Prioritise finishing over buying more.
 * 5. Surface duplicates, idle yarn, stuck WIPs, and realistic next steps.
 */

import type { Project, Yarn, YarnWeight } from "@/types";

export type InsightKind =
  | "finish"
  | "stash"
  | "match"
  | "health"
  | "nudge";

export interface Insight {
  id: string;
  kind: InsightKind;
  title: string;
  body: string;
  priority: number; // higher = more important
  actionLabel?: string;
  actionHref?: string;
}

export interface GuideContext {
  yarns: Yarn[];
  projects: Project[];
}

export interface GuideReply {
  answer: string;
  insights: Insight[];
  relatedYarnIds: string[];
  relatedProjectIds: string[];
}

const WEIGHT_ORDER: YarnWeight[] = [
  "lace",
  "fingering",
  "sport",
  "dk",
  "worsted",
  "aran",
  "bulky",
  "super-bulky",
  "jumbo",
];

function totalSkeins(yarns: Yarn[]) {
  return yarns.reduce((sum, y) => sum + (Number(y.quantity) || 0), 0);
}

function estimatedYards(y: Yarn) {
  if (!y.yardagePerSkein) return null;
  return y.yardagePerSkein * (Number(y.quantity) || 0);
}

function weightBuckets(yarns: Yarn[]) {
  const map = new Map<string, number>();
  for (const y of yarns) {
    map.set(y.weight, (map.get(y.weight) || 0) + (Number(y.quantity) || 0));
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function stuckWips(projects: Project[]) {
  return projects
    .filter((p) => p.status === "wip")
    .sort((a, b) => a.progress - b.progress);
}

function nearlyDone(projects: Project[]) {
  return projects
    .filter((p) => p.status === "wip" && p.progress >= 70)
    .sort((a, b) => b.progress - a.progress);
}

function orphanYarns(yarns: Yarn[], projects: Project[]) {
  const used = new Set(projects.flatMap((p) => p.yarnIds || []));
  return yarns.filter((y) => !used.has(y.id));
}

function possibleDuplicates(yarns: Yarn[]) {
  const groups: Yarn[][] = [];
  const seen = new Set<string>();

  for (const y of yarns) {
    if (seen.has(y.id)) continue;
    const keyBrand = (y.brand || "").toLowerCase();
    const keyColor = (y.colorway || "").toLowerCase();
    const keyName = y.name.toLowerCase();

    const matches = yarns.filter((other) => {
      if (other.id === y.id) return false;
      const b = (other.brand || "").toLowerCase();
      const c = (other.colorway || "").toLowerCase();
      const n = other.name.toLowerCase();
      if (keyBrand && keyColor && b === keyBrand && c === keyColor) return true;
      if (n === keyName && keyBrand && b === keyBrand) return true;
      return false;
    });

    if (matches.length) {
      const group = [y, ...matches];
      group.forEach((g) => seen.add(g.id));
      groups.push(group);
    }
  }
  return groups;
}

/** Build prioritised insights from real user data */
export function buildInsights(ctx: GuideContext): Insight[] {
  const { yarns, projects } = ctx;
  const insights: Insight[] = [];

  if (yarns.length === 0 && projects.length === 0) {
    insights.push({
      id: "empty-start",
      kind: "nudge",
      title: "Start with what you already own",
      body: "Add three skeins from your real stash. Guide gets smarter the moment your yarn is in Laine — not before.",
      priority: 100,
      actionLabel: "Add yarn",
      actionHref: "/stash/new",
    });
    return insights;
  }

  const almost = nearlyDone(projects);
  if (almost.length) {
    const p = almost[0];
    insights.push({
      id: `finish-${p.id}`,
      kind: "finish",
      title: `Finish push: ${p.name}`,
      body: `You are at ${p.progress}%. One focused session may get this off the needles. Finishing beats starting another WIP.`,
      priority: 95,
      actionLabel: "Open projects",
      actionHref: "/projects",
    });
  }

  const stuck = stuckWips(projects).filter((p) => p.progress < 40);
  if (stuck.length >= 2) {
    insights.push({
      id: "too-many-wips",
      kind: "finish",
      title: `${stuck.length} quiet WIPs`,
      body: "Several projects are under 40%. Pick one primary WIP this week. Park the rest without guilt — Laine will keep them safe.",
      priority: 88,
      actionLabel: "Review projects",
      actionHref: "/projects",
    });
  } else if (stuck.length === 1) {
    insights.push({
      id: `stuck-${stuck[0].id}`,
      kind: "finish",
      title: `${stuck[0].name} needs a decision`,
      body: `At ${stuck[0].progress}%. Either schedule one hour for it, simplify the pattern, or mark it parked. Open loops drain stash joy.`,
      priority: 80,
      actionLabel: "See projects",
      actionHref: "/projects",
    });
  }

  const dupes = possibleDuplicates(yarns);
  if (dupes.length) {
    const sample = dupes[0];
    const label = sample
      .map((y) => [y.brand, y.name, y.colorway].filter(Boolean).join(" "))
      .join(" / ");
    insights.push({
      id: "dupes",
      kind: "health",
      title: "Possible double-ups in stash",
      body: `Laine spotted similar entries (${label}). Merge quantities or note dye lots so you do not buy a third.`,
      priority: 75,
      actionLabel: "Search stash",
      actionHref: "/stash",
    });
  }

  const orphans = orphanYarns(yarns, projects);
  const orphanWithYards = orphans.filter((y) => (estimatedYards(y) || 0) >= 400);
  if (orphanWithYards.length) {
    const y = orphanWithYards.sort(
      (a, b) => (estimatedYards(b) || 0) - (estimatedYards(a) || 0)
    )[0];
    const yards = estimatedYards(y);
    insights.push({
      id: `orphan-${y.id}`,
      kind: "match",
      title: `Idle yarn: ${y.name}`,
      body: `About ${yards} yards of ${y.weight}${y.fiber ? ` ${y.fiber}` : ""} with no linked project. Good candidate for a hat, cowl, or small FO — use what you own.`,
      priority: 70,
      actionLabel: "Start a project",
      actionHref: "/projects/new",
    });
  }

  const buckets = weightBuckets(yarns);
  if (buckets.length) {
    const [topWeight, count] = buckets[0];
    insights.push({
      id: "weight-profile",
      kind: "stash",
      title: `Your stash leans ${topWeight}`,
      body: `${count} skeins in ${topWeight}. When browsing patterns, filter to ${topWeight} first — higher chance you can cast on without shopping.`,
      priority: 55,
      actionLabel: "View stash",
      actionHref: "/stash",
    });
  }

  const noLocation = yarns.filter((y) => !y.location);
  if (noLocation.length >= 3) {
    insights.push({
      id: "locations",
      kind: "health",
      title: `${noLocation.length} skeins with no home`,
      body: "Add a location (bin, shelf, bag). Future-you will find yarn in seconds instead of unpacking the whole cupboard.",
      priority: 50,
      actionLabel: "Edit stash",
      actionHref: "/stash",
    });
  }

  if (projects.filter((p) => p.status === "finished").length === 0 && projects.some((p) => p.status === "wip")) {
    insights.push({
      id: "first-fo",
      kind: "nudge",
      title: "Chase one Finished Object",
      body: "No FOs logged yet. Pick the WIP closest to done. A single FO rebuilds momentum more than three new cast-ons.",
      priority: 85,
      actionLabel: "Projects",
      actionHref: "/projects",
    });
  }

  const planned = projects.filter((p) => p.status === "planned");
  if (planned.length && yarns.length) {
    insights.push({
      id: "planned-vs-stash",
      kind: "match",
      title: `${planned.length} planned project${planned.length > 1 ? "s" : ""} waiting`,
      body: "Before casting on something new, check planned projects against your stash weights. Shop your stash first.",
      priority: 60,
      actionLabel: "Projects",
      actionHref: "/projects",
    });
  }

  return insights.sort((a, b) => b.priority - a.priority);
}

function summariseStash(yarns: Yarn[]) {
  if (!yarns.length) return "Your stash is empty in Laine.";
  const skeins = totalSkeins(yarns);
  const buckets = weightBuckets(yarns)
    .slice(0, 3)
    .map(([w, n]) => `${n} ${w}`)
    .join(", ");
  return `You have ${yarns.length} yarn entries (~${skeins} skeins). Top weights: ${buckets || "—"}.`;
}

function summariseProjects(projects: Project[]) {
  if (!projects.length) return "No projects logged yet.";
  const wip = projects.filter((p) => p.status === "wip").length;
  const planned = projects.filter((p) => p.status === "planned").length;
  const finished = projects.filter((p) => p.status === "finished").length;
  return `Projects: ${wip} WIP, ${planned} planned, ${finished} finished.`;
}

/** Intent detection — maker language, not generic assistant */
function detectIntent(question: string): string {
  const q = question.toLowerCase();
  if (/(what can i (make|knit|crochet)|cast on|use up|stash down)/.test(q)) return "make";
  if (/(finish|wip|stuck|frog|complete)/.test(q)) return "finish";
  if (/(buy|purchase|need more|shop)/.test(q)) return "buy";
  if (/(where|find|location|bin|closet)/.test(q)) return "where";
  if (/(duplicate|already own|same yarn)/.test(q)) return "dupe";
  if (/(summary|overview|how much|stash health)/.test(q)) return "summary";
  if (/(hat|cowl|scarf|sock|sweater|cardigan|blanket)/.test(q)) return "project-type";
  return "general";
}

export function askGuide(question: string, ctx: GuideContext): GuideReply {
  const insights = buildInsights(ctx);
  const intent = detectIntent(question);
  const relatedYarnIds: string[] = [];
  const relatedProjectIds: string[] = [];

  let answer = "";

  switch (intent) {
    case "make": {
      const orphans = orphanYarns(ctx.yarns, ctx.projects);
      const rich = orphans
        .map((y) => ({ y, yards: estimatedYards(y) }))
        .filter((x) => (x.yards || 0) > 0)
        .sort((a, b) => (b.yards || 0) - (a.yards || 0));

      if (!ctx.yarns.length) {
        answer =
          "Add a few skeins first. Guide can only suggest from yarn you actually log — that is the point of Laine.";
      } else if (rich.length) {
        const top = rich.slice(0, 3);
        top.forEach((t) => relatedYarnIds.push(t.y.id));
        answer =
          "Shop your stash before you shop online:\n\n" +
          top
            .map(
              (t) =>
                `• ${t.y.name}${t.y.brand ? ` (${t.y.brand})` : ""} — ${t.y.weight}, ~${t.yards} yards${
                  t.y.location ? `, ${t.y.location}` : ""
                }`
            )
            .join("\n") +
          "\n\nHats, cowls, and mitts are realistic for mid yardage. Sweaters need a clear yardage total — check labels before casting on.";
      } else {
        const buckets = weightBuckets(ctx.yarns);
        answer =
          summariseStash(ctx.yarns) +
          (buckets[0]
            ? `\n\nStrongest cast-on path: patterns in ${buckets[0][0]} weight. You already own the most of that.`
            : "");
      }
      break;
    }
    case "finish": {
      const almost = nearlyDone(ctx.projects);
      const wips = stuckWips(ctx.projects);
      if (almost.length) {
        relatedProjectIds.push(almost[0].id);
        answer = `Closest to done: “${almost[0].name}” at ${almost[0].progress}%. Protect one session for bind-off and blocking notes. New cast-ons can wait.`;
      } else if (wips.length) {
        relatedProjectIds.push(wips[0].id);
        answer = `Focus WIP: “${wips[0].name}” (${wips[0].progress}%). If it is stalled on a hard section, skip to a simpler part or frog early — stuck projects cost more joy than yarn.`;
      } else {
        answer =
          "No active WIPs. When you start one, log it here so Guide can prioritise finishing over collecting.";
      }
      break;
    }
    case "buy": {
      answer =
        "Default answer from Laine: maybe not yet.\n\n" +
        summariseStash(ctx.yarns) +
        "\n\nCheck search in Stash for the brand/colorway first. If you already own a close match, note dye lot differences before buying.";
      break;
    }
    case "where": {
      const withLoc = ctx.yarns.filter((y) => y.location);
      const without = ctx.yarns.length - withLoc.length;
      answer = withLoc.length
        ? `Locations logged on ${withLoc.length} entries. ${
            without ? `${without} still have no home — edit those next.` : "All listed yarn has a place."
          }\n\nUse Stash search by room, bin, or bag name.`
        : "No locations saved yet. Add “bin 2”, “hall closet”, or “project bag” on each skein — that is high-leverage organisation.";
      break;
    }
    case "dupe": {
      const dupes = possibleDuplicates(ctx.yarns);
      if (!dupes.length) {
        answer = "No obvious duplicates by brand + colorway or same name. Still search before big purchases.";
      } else {
        answer =
          "Possible duplicates:\n" +
          dupes
            .slice(0, 4)
            .map((g) =>
              g.map((y) => [y.brand, y.name, y.colorway].filter(Boolean).join(" ")).join(" ↔ ")
            )
            .join("\n");
      }
      break;
    }
    case "summary": {
      answer = `${summariseStash(ctx.yarns)}\n${summariseProjects(ctx.projects)}`;
      break;
    }
    case "project-type": {
      const q = question.toLowerCase();
      let target = "accessory";
      if (/sweater|cardigan|jumper/.test(q)) target = "garment";
      if (/sock/.test(q)) target = "socks";
      if (/blanket|afghan/.test(q)) target = "blanket";

      const fingering = ctx.yarns.filter((y) => y.weight === "fingering" || y.weight === "sock" as YarnWeight);
      const dk = ctx.yarns.filter((y) => y.weight === "dk" || y.weight === "worsted");

      if (target === "socks" && fingering.length) {
        fingering.slice(0, 3).forEach((y) => relatedYarnIds.push(y.id));
        answer = `Sock-friendly yarn in your stash:\n${fingering
          .slice(0, 5)
          .map((y) => `• ${y.name}${y.colorway ? ` — ${y.colorway}` : ""} (${y.weight})`)
          .join("\n")}`;
      } else if (target === "garment") {
        answer =
          "For sweaters/cardigans, total yardage matters more than skein count. Sum yardage on matching weight + fiber, then compare to the pattern range. If short, prefer a size down or colour-block with a second stash yarn — do not assume one skein equals one project.";
      } else {
        answer =
          summariseStash(ctx.yarns) +
          "\n\nAccessories (hat/cowl/scarf) are the highest success rate for stash-busting. Match weight first, then fiber next to skin.";
      }
      break;
    }
    default: {
      answer =
        `${summariseStash(ctx.yarns)}\n${summariseProjects(ctx.projects)}\n\n` +
        "Ask me things like:\n" +
        "• What can I make with my stash?\n" +
        "• What should I finish next?\n" +
        "• Do I already own this?\n" +
        "• Where is my yarn?\n\n" +
        "I only answer from your Laine data — not from the whole internet.";
    }
  }

  return {
    answer,
    insights: insights.slice(0, 5),
    relatedYarnIds,
    relatedProjectIds,
  };
}

export function starterPrompts(): string[] {
  return [
    "What can I make with my stash?",
    "What should I finish next?",
    "Do I have duplicate yarn?",
    "Summarise my stash health",
    "Should I buy more yarn?",
  ];
}
