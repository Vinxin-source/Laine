"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { Circle, CircleFOPost, CircleMember } from "@/types/circles";
import { PURPOSE_LABELS } from "@/types/circles";
import {
  addFOPost,
  getCircle,
  getMembers,
  leaveCircle,
  listFO,
} from "@/lib/circles/storage";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StashMatchPanel } from "@/components/circles/StashMatchPanel";
import { FinishChallengeCard } from "@/components/circles/FinishChallengeCard";

export function CircleDetail({ id }: { id: string }) {
  const [circle, setCircle] = useState<Circle | null>(null);
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [posts, setPosts] = useState<CircleFOPost[]>([]);
  const [caption, setCaption] = useState("");
  const [projectName, setProjectName] = useState("");

  function refresh() {
    setCircle(getCircle(id) ?? null);
    setMembers(getMembers(id));
    setPosts(listFO(id));
  }

  useEffect(() => {
    refresh();
  }, [id]);

  function onFO(e: FormEvent) {
    e.preventDefault();
    if (!caption.trim()) return;
    addFOPost({ circleId: id, caption, projectName: projectName || undefined });
    setCaption("");
    setProjectName("");
    refresh();
  }

  function onLeave() {
    if (!confirm("Leave this Circle? You can rejoin later with the invite code.")) return;
    leaveCircle(id);
    window.location.href = "/circles";
  }

  if (!circle) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        Circle not found.{" "}
        <Link href="/circles" className="text-[var(--primary)]">
          Back
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/circles" className="text-sm text-[var(--text-secondary)]">
          ← All Circles
        </Link>
        <h1 className="text-2xl font-serif mt-2">{circle.name}</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {PURPOSE_LABELS[circle.purpose]} · {circle.memberCount}/{circle.maxMembers} members ·
          Invite only
        </p>
        {circle.description ? (
          <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-xl">{circle.description}</p>
        ) : null}
      </div>

      <Card padding="md">
        <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Invite code</p>
        <p className="mt-1 font-mono text-lg text-[var(--primary)]">{circle.inviteCode}</p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">
          Share only with makers you trust. Codes are not listed publicly.
        </p>
      </Card>

      <section>
        <h2 className="text-lg font-medium mb-3">Members · soft status</h2>
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          Finishes this month are visible here only — encouragement, not a public leaderboard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {members.map((m) => (
            <Card key={m.userId + m.joinedAt} padding="sm">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{m.displayName}</p>
                  <p className="text-xs text-[var(--text-secondary)] capitalize">{m.role}</p>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {m.finishesThisMonth} FO this month
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">FO feed (opt-in)</h2>
        <Card padding="md" className="mb-4 max-w-xl">
          <form className="space-y-3" onSubmit={onFO}>
            <Input
              label="Share a finished object"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Short note — what you finished"
              required
            />
            <Input
              label="Project name (optional)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Moss hat"
            />
            <Button type="submit" size="sm">
              Post to Circle
            </Button>
          </form>
        </Card>

        {posts.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">No FO posts yet. Be the first.</p>
        ) : (
          <div className="space-y-3 max-w-xl">
            {posts.map((p) => (
              <Card key={p.id} padding="md">
                <p className="text-xs text-[var(--text-secondary)]">
                  {p.displayName} · {new Date(p.createdAt).toLocaleDateString()}
                </p>
                {p.projectName ? (
                  <p className="text-sm font-medium mt-1">{p.projectName}</p>
                ) : null}
                <p className="text-sm text-[var(--text-secondary)] mt-1">{p.caption}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <FinishChallengeCard circleId={id} />

      <StashMatchPanel members={members} />

      <section>
        <h2 className="text-lg font-medium mb-3">Safety & norms</h2>
        <Card padding="md" className="text-sm text-[var(--text-secondary)] space-y-2 max-w-xl">
          <p>No politics or harassment.</p>
          <p>No sharing paid patterns or piracy.</p>
          <p>Stash trade talk: {circle.rules.allowStashTradeTalk ? "allowed" : "off by default"}.</p>
          <p>{circle.rules.customNote}</p>
          <div className="pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={onLeave}>
              Leave Circle
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
