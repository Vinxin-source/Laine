"use client";

import type { Yarn, YarnWeight } from "@/types";
import { getSupabase, isCloudEnabled } from "@/lib/supabase-client";
import * as local from "@/lib/storage";

type YarnInput = Omit<Yarn, "id" | "userId" | "createdAt" | "updatedAt">;

function mapRow(row: Record<string, unknown>): Yarn {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    name: String(row.name),
    brand: (row.brand as string) || undefined,
    colorway: (row.colorway as string) || undefined,
    weight: row.weight as YarnWeight,
    fiber: (row.fiber as string) || undefined,
    quantity: Number(row.quantity ?? 1),
    yardagePerSkein: row.yardage_per_skein != null ? Number(row.yardage_per_skein) : undefined,
    location: (row.location as string) || undefined,
    photoUrl: (row.photo_url as string) || undefined,
    notes: (row.notes as string) || undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listYarns(): Promise<Yarn[]> {
  if (!isCloudEnabled()) return local.getYarns();
  const supabase = getSupabase();
  if (!supabase) return local.getYarns();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return local.getYarns();
  const { data, error } = await supabase
    .from("yarns")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });
  if (error || !data) return local.getYarns();
  return data.map(mapRow);
}

export async function createYarn(input: YarnInput): Promise<Yarn> {
  if (!isCloudEnabled()) return local.saveYarn(input);
  const supabase = getSupabase();
  if (!supabase) return local.saveYarn(input);
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return local.saveYarn(input);
  const { data, error } = await supabase
    .from("yarns")
    .insert({
      user_id: userData.user.id,
      name: input.name,
      brand: input.brand ?? null,
      colorway: input.colorway ?? null,
      weight: input.weight,
      fiber: input.fiber ?? null,
      quantity: input.quantity,
      yardage_per_skein: input.yardagePerSkein ?? null,
      location: input.location ?? null,
      photo_url: input.photoUrl ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error || !data) return local.saveYarn(input);
  return mapRow(data);
}

export async function patchYarn(id: string, patch: Partial<YarnInput>): Promise<Yarn | null> {
  if (!isCloudEnabled()) return local.updateYarn(id, patch);
  const supabase = getSupabase();
  if (!supabase) return local.updateYarn(id, patch);
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return local.updateYarn(id, patch);
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.brand !== undefined) row.brand = patch.brand ?? null;
  if (patch.colorway !== undefined) row.colorway = patch.colorway ?? null;
  if (patch.weight !== undefined) row.weight = patch.weight;
  if (patch.fiber !== undefined) row.fiber = patch.fiber ?? null;
  if (patch.quantity !== undefined) row.quantity = patch.quantity;
  if (patch.yardagePerSkein !== undefined) row.yardage_per_skein = patch.yardagePerSkein ?? null;
  if (patch.location !== undefined) row.location = patch.location ?? null;
  if (patch.photoUrl !== undefined) row.photo_url = patch.photoUrl ?? null;
  if (patch.notes !== undefined) row.notes = patch.notes ?? null;
  const { data, error } = await supabase
    .from("yarns")
    .update(row)
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .select("*")
    .single();
  if (error || !data) return local.updateYarn(id, patch);
  return mapRow(data);
}

export async function removeYarn(id: string): Promise<void> {
  if (!isCloudEnabled()) {
    local.deleteYarn(id);
    return;
  }
  const supabase = getSupabase();
  if (!supabase) {
    local.deleteYarn(id);
    return;
  }
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    local.deleteYarn(id);
    return;
  }
  await supabase.from("yarns").delete().eq("id", id).eq("user_id", userData.user.id);
  local.deleteYarn(id);
}

export function findSimilarLocal(input: { name: string; brand?: string; colorway?: string }) {
  return local.findSimilarYarns(input);
}

export async function getYarnById(id: string): Promise<Yarn | undefined> {
  const all = await listYarns();
  return all.find((y) => y.id === id) || local.getYarn(id);
}
