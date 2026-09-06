"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/lib/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    if (password.length < 8) {
      setLoading(false);
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }
    const result = await updatePassword(password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/stash");
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Input name="password" label="New password" type="password" required minLength={8} />
      <Input name="confirm" label="Confirm password" type="password" required minLength={8} />
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save new password"}
      </Button>
    </form>
  );
}
