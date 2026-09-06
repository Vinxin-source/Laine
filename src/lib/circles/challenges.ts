import type { FinishChallenge } from "@/types/circles";

const KEY = "laine_challenges";

function read(): FinishChallenge[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(list: FinishChallenge[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

function monthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function getChallenge(circleId: string): FinishChallenge | null {
  const key = monthKey();
  return read().find((c) => c.circleId === circleId && c.monthKey === key) || null;
}

export function ensureMonthlyChallenge(circleId: string): FinishChallenge {
  const existing = getChallenge(circleId);
  if (existing) return existing;

  const challenge: FinishChallenge = {
    id: crypto.randomUUID(),
    circleId,
    title: "Clear the WIP pile",
    targetFinishes: 2,
    monthKey: monthKey(),
    participantIds: [],
  };
  const list = read();
  list.push(challenge);
  write(list);
  return challenge;
}

export function joinChallenge(circleId: string, userId = "local"): FinishChallenge {
  const challenge = ensureMonthlyChallenge(circleId);
  if (!challenge.participantIds.includes(userId)) {
    challenge.participantIds.push(userId);
    const list = read().map((c) => (c.id === challenge.id ? challenge : c));
    write(list);
  }
  return challenge;
}
