"use client";

import { getSupabase, isCloudEnabled } from "@/lib/supabase-client";

function siteUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function signUp(email: string, password: string, displayName?: string) {
  const supabase = getSupabase();
  if (!supabase) {
    return { error: "Cloud not configured. App still works offline on this device." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || "" },
      emailRedirectTo: `${siteUrl()}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      display_name: displayName || null,
    });
  }

  return { data, message: "Check your email to confirm, then log in." };
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) {
    return { error: "Cloud not configured. Use the app on this device for now." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { data };
}

/** No password — email magic link (easiest on phone) */
export async function signInWithMagicLink(email: string) {
  const supabase = getSupabase();
  if (!supabase) {
    return { error: "Cloud not configured yet." };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) return { error: error.message };
  return {
    message: "Check your email for a login link. After you tap it, you stay signed in on this phone.",
  };
}

export async function requestPasswordReset(email: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: "Cloud not configured yet." };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/reset-password`,
  });

  if (error) return { error: error.message };
  return { message: "If that email exists, we sent a reset link." };
}

export async function updatePassword(newPassword: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: "Cloud not configured yet." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { message: "Password updated. You can use it next time, or keep using magic link." };
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getSessionUser() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export { isCloudEnabled };
