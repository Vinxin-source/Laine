import type { Circle, CircleFOPost, CircleMember } from "@/types/circles";
import { DEFAULT_CIRCLE_RULES } from "@/types/circles";

const CIRCLES_KEY = "laine_circles";
const MEMBERS_KEY = "laine_circle_members";
const FO_KEY = "laine_circle_fo";
const MAX_MEMBERS = 30;

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

function code() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function listCircles(): Circle[] {
  return read<Circle>(CIRCLES_KEY);
}

export function getCircle(id: string): Circle | undefined {
  return listCircles().find((c) => c.id === id);
}

export function createCircle(input: {
  name: string;
  description?: string;
  purpose: Circle["purpose"];
  ownerId?: string;
  ownerName?: string;
}): Circle {
  const circles = listCircles();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const ownerId = input.ownerId || "local";

  const circle: Circle = {
    id,
    name: input.name.trim(),
    description: input.description?.trim(),
    purpose: input.purpose,
    ownerId,
    memberCount: 1,
    maxMembers: MAX_MEMBERS,
    joinPolicy: "invite_only",
    inviteCode: code(),
    rules: { ...DEFAULT_CIRCLE_RULES },
    createdAt: now,
    updatedAt: now,
  };

  circles.unshift(circle);
  write(CIRCLES_KEY, circles);

  const members = read<CircleMember>(MEMBERS_KEY);
  members.push({
    circleId: id,
    userId: ownerId,
    displayName: input.ownerName || "You",
    role: "owner",
    joinedAt: now,
    finishesThisMonth: 0,
  });
  write(MEMBERS_KEY, members);

  return circle;
}

export function joinCircleByCode(
  inviteCode: string,
  userId = "local",
  displayName = "Maker"
): { ok: true; circle: Circle } | { ok: false; error: string } {
  const circles = listCircles();
  const circle = circles.find(
    (c) => c.inviteCode.toUpperCase() === inviteCode.trim().toUpperCase()
  );
  if (!circle) return { ok: false, error: "Invite code not found." };
  if (circle.memberCount >= circle.maxMembers) {
    return { ok: false, error: "This Circle is full (max 30)." };
  }

  const members = read<CircleMember>(MEMBERS_KEY);
  if (members.some((m) => m.circleId === circle.id && m.userId === userId)) {
    return { ok: true, circle };
  }

  members.push({
    circleId: circle.id,
    userId,
    displayName,
    role: "member",
    joinedAt: new Date().toISOString(),
    finishesThisMonth: 0,
  });
  write(MEMBERS_KEY, members);

  circle.memberCount += 1;
  circle.updatedAt = new Date().toISOString();
  write(
    CIRCLES_KEY,
    circles.map((c) => (c.id === circle.id ? circle : c))
  );

  return { ok: true, circle };
}

export function getMembers(circleId: string): CircleMember[] {
  return read<CircleMember>(MEMBERS_KEY).filter((m) => m.circleId === circleId);
}

export function leaveCircle(circleId: string, userId = "local") {
  const members = read<CircleMember>(MEMBERS_KEY).filter(
    (m) => !(m.circleId === circleId && m.userId === userId)
  );
  write(MEMBERS_KEY, members);

  const circles = listCircles().map((c) => {
    if (c.id !== circleId) return c;
    return {
      ...c,
      memberCount: Math.max(0, c.memberCount - 1),
      updatedAt: new Date().toISOString(),
    };
  });
  write(CIRCLES_KEY, circles);
}

export function listFO(circleId: string): CircleFOPost[] {
  return read<CircleFOPost>(FO_KEY)
    .filter((p) => p.circleId === circleId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addFOPost(input: {
  circleId: string;
  caption: string;
  projectName?: string;
  photoUrl?: string;
  userId?: string;
  displayName?: string;
}): CircleFOPost {
  const posts = read<CircleFOPost>(FO_KEY);
  const post: CircleFOPost = {
    id: crypto.randomUUID(),
    circleId: input.circleId,
    userId: input.userId || "local",
    displayName: input.displayName || "You",
    caption: input.caption.trim(),
    projectName: input.projectName?.trim(),
    photoUrl: input.photoUrl?.trim(),
    createdAt: new Date().toISOString(),
  };
  posts.unshift(post);
  write(FO_KEY, posts);
  bumpFinishCount(input.circleId, input.userId || "local");
  return post;
}

export function bumpFinishCount(circleId: string, userId = "local") {
  const members = read<CircleMember>(MEMBERS_KEY).map((m) => {
    if (m.circleId === circleId && m.userId === userId) {
      return { ...m, finishesThisMonth: (m.finishesThisMonth || 0) + 1 };
    }
    return m;
  });
  write(MEMBERS_KEY, members);
}

