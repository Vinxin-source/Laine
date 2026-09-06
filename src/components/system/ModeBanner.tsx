"use client";

import { isCloudEnabled } from "@/lib/supabase-client";

export function ModeBanner() {
  const cloud = isCloudEnabled();

  return (
    <div className="mb-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-secondary)]">
      {cloud ? (
        <span>Cloud mode on — your stash can sync when you are logged in.</span>
      ) : (
        <span>
          Offline device mode — stash saves on this phone/browser only. Add free Supabase
          keys later to sync across devices.
        </span>
      )}
    </div>
  );
}
