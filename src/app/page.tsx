import { AppShell } from "@/components/layout/AppShell";
import { AccountPanel } from "@/components/account/AccountPanel";

export default function AccountPage() {
  return (
    <AppShell>
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-serif">Account</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Plan, login, and device settings
        </p>
      </div>
      <AccountPanel />
    </AppShell>
  );
}
