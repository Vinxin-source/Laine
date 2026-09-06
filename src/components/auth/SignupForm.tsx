"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signInWithMagicLink, isCloudEnabled } from "@/lib/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const cloud = isCloudEnabled();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const displayName = String(form.get("displayName") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    // If password left short, prefer magic link path
    if (!password || password.length < 8) {
      const result = await signInWithMagicLink(email);
      setLoading(false);
      if (result.error) setError(result.error);
      else setMessage(result.message || "Check your email for a link to finish signing up.");
      return;
    }

    const result = await signUp(email, password, displayName);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage(result.message || "Account created. Check email if asked to confirm.");
    router.push("/login");
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {!cloud ? (
        <p className="text-xs text-[var(--text-secondary)] rounded-[var(--radius-md)] border border-[var(--border)] p-3">
          Cloud signup needs Supabase keys on Vercel. Until then use the app offline on this device.
        </p>
      ) : null}
      <Input name="displayName" label="Display name" placeholder="Your name" />
      <Input name="email" label="Email" type="email" placeholder="you@email.com" required />
      <Input
        name="password"
        label="Password (optional)"
        type="password"
        hint="Leave blank to sign up with an email link instead — easier on phone"
        minLength={8}
      />
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--success)]">{message}</p> : null}
      <Button className="w-full" type="submit" disabled={loading || !cloud}>
        {loading ? "Working…" : "Create account"}
      </Button>
      <p className="text-sm text-[var(--text-secondary)] text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--primary)]">
          Log in
        </Link>
      </p>
    </form>
  );
}
