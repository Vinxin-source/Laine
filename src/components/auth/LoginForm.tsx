"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signInWithMagicLink, isCloudEnabled } from "@/lib/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const cloud = isCloudEnabled();

  async function onMagic(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const email = String(new FormData(e.currentTarget).get("email") || "");
    const result = await signInWithMagicLink(email);
    setLoading(false);
    if (result.error) setError(result.error);
    else setMessage(result.message || "Check your email.");
  }

  async function onPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const result = await signIn(String(form.get("email") || ""), String(form.get("password") || ""));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/stash");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {!cloud ? (
        <p className="text-xs text-[var(--text-secondary)] rounded-[var(--radius-md)] border border-[var(--border)] p-3">
          Add Supabase keys on Vercel to enable email login. Stash still works offline on this device.
        </p>
      ) : null}

      <div className="flex gap-2 text-sm">
        <button
          type="button"
          className={mode === "magic" ? "text-[var(--primary)] font-medium" : "text-[var(--text-secondary)]"}
          onClick={() => setMode("magic")}
        >
          Email link (easier)
        </button>
        <span className="text-[var(--border)]">|</span>
        <button
          type="button"
          className={mode === "password" ? "text-[var(--primary)] font-medium" : "text-[var(--text-secondary)]"}
          onClick={() => setMode("password")}
        >
          Password
        </button>
      </div>

      {mode === "magic" ? (
        <form className="space-y-4" onSubmit={onMagic}>
          <Input name="email" label="Email" type="email" placeholder="you@email.com" required />
          <p className="text-xs text-[var(--text-secondary)]">
            We email you a one-tap link. No password to remember. Stay signed in on this phone.
          </p>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          {message ? <p className="text-sm text-[var(--success)]">{message}</p> : null}
          <Button className="w-full" type="submit" disabled={loading || !cloud}>
            {loading ? "Sending…" : "Email me a login link"}
          </Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={onPassword}>
          <Input name="email" label="Email" type="email" placeholder="you@email.com" required />
          <Input name="password" label="Password" type="password" required />
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={loading || !cloud}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
          <p className="text-sm text-center">
            <Link href="/forgot-password" className="text-[var(--primary)]">
              Forgot password?
            </Link>
          </p>
        </form>
      )}

      <p className="text-sm text-[var(--text-secondary)] text-center">
        New to Laine?{" "}
        <Link href="/signup" className="text-[var(--primary)]">
          Start free
        </Link>
      </p>
    </div>
  );
}
