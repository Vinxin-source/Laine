export type CirclePurpose =
  | "finish_club"
  | "technique"
  | "fo_share"
  | "quiet_chat"
  | "stash_help";

export type CircleMemberRole = "owner" | "admin" | "member";

export type CircleJoinPolicy = "invite_only";

export interface CircleRules {
  noPolitics: boolean;
  noPatternPiracy: boolean;
  allowStashTradeTalk: boolean;
  foOptInOnly: boolean;
  customNote?: string;
}

export interface Circle {
  id: string;
  name: string;
  description?: string;
  purpose: CirclePurpose;
  ownerId: string;
  memberCount: number;
  maxMembers: number; // hard 30
  joinPolicy: CircleJoinPolicy;
  inviteCode: string;
  rules: CircleRules;
  createdAt: string;
  updatedAt: string;
}

export interface CircleMember {
  circleId: string;
  userId: string;
  displayName: string;
  role: CircleMemberRole;
  joinedAt: string;
  finishesThisMonth: number;
  isMuted?: boolean;
}

export interface CircleFOPost {
  id: string;
  circleId: string;
  userId: string;
  displayName: string;
  photoUrl?: string;
  caption: string;
  projectName?: string;
  createdAt: string;
}

export interface FinishChallenge {
  id: string;
  circleId: string;
  title: string;
  targetFinishes: number; // e.g. 1–3
  monthKey: string; // YYYY-MM
  participantIds: string[];
}

export const PURPOSE_LABELS: Record<CirclePurpose, string> = {
  finish_club: "Finish club",
  technique: "Technique & help",
  fo_share: "FO sharing",
  quiet_chat: "Quiet maker chat",
  stash_help: "Stash help",
};

export const DEFAULT_CIRCLE_RULES: CircleRules = {
  noPolitics: true,
  noPatternPiracy: true,
  allowStashTradeTalk: false,
  foOptInOnly: true,
  customNote:
    "Be kind. Assume good intent. No shaming unfinished work. Report problems to the owner.",
};
