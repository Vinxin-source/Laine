"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getYarns, getProjects } from "@/lib/storage";
import { buildStashContext } from "@/lib/ai/context";
import { generateInsights, answerFromStash } from "@/lib/ai/insights";
import type { GuideMessage } from "@/lib/ai/types";
import { InsightCard } from "@/components/ai/InsightCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function GuidePanel() {
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<GuideMessage[]>([]);
  const [input, setInput] = useState("");

  const ctx = useMemo(() => {
    if (!ready) return null;
    return buildStashContext(getYarns(), getProjects());
  }, [ready]);

  const insights = useMemo(() => {
    if (!ctx) return [];
    return generateInsights(ctx);
  }, [ctx]);

  useEffect(() => {
    setReady(true);
    setMessages([
      {
        id: "welcome",
        role: "guide",
        content:
          "I only use what you have logged in Laine — your yarn and projects. Ask about weights, WIPs, or locations. I will not invent stash or write patterns.",
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  function onAsk(e: FormEvent) {
    e.preventDefault();
    if (!ctx || !input.trim()) return;

    const userMsg: GuideMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    const reply: GuideMessage = {
      id: crypto.randomUUID(),
      role: "guide",
      content: answerFromStash(input.trim(), ctx),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, reply]);
    setInput("");
  }

  if (!ready || !ctx) {
    return <p className="text-sm text-[var(--text-secondary)]">Loading Guide…</p>;
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-medium mb-3">Personal insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Ask about your stash</h2>
        <Card padding="md" className="max-w-2xl">
          <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`text-sm leading-relaxed ${
                  m.role === "user"
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  {m.role === "user" ? "You" : "Guide"}
                </span>
                <p className="mt-0.5">{m.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={onAsk} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. What DK do I own?"
              className="flex-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
            <Button type="submit">Ask</Button>
          </form>
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            Free Guide runs on your data only — no pattern generation, no made-up yarn.
          </p>
        </Card>
      </section>
    </div>
  );
}
