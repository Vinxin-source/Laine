"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;

    setIsIos(ios);

    if (standalone) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // iOS has no beforeinstallprompt — show gentle tip instead
    if (ios && !standalone) {
      setVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!visible) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    }
    setDeferred(null);
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-4 z-50 mx-auto max-w-md">
      <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          Add Laine to your phone
        </p>
        {isIos ? (
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            On iPhone: tap Share, then “Add to Home Screen”.
          </p>
        ) : (
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Install for quick access — works like an app, no App Store needed.
          </p>
        )}
        <div className="mt-3 flex gap-2">
          {!isIos && deferred ? (
            <Button size="sm" onClick={install}>
              Install
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={() => setVisible(false)}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}
