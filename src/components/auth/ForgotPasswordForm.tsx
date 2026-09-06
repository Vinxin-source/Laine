"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { requestPasswordReset, isCloudEnabled } from "@/lib/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const cloud = isCloudEnabled();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const email = String(new FormData(e.currentTarget).get("email") || "");
    const result = await requestPasswordReset(email);
    setLoading(false);
    if (result.error) setError(result.error);
    else setMessage(result.message || "Check your email.");
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Input name="email" label="Email" type="email" required placeholder="you@email.com" />
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--success)]">{message}</p> : null}
      <Button className="w-full" type="submit" disabled={loading || !cloud}>
        {loading ? "Sending…" : "Send reset link"}
      </Button>
      <p className="text-sm text-center">
        <Link href="/login" className="text-[var(--primary)]">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
