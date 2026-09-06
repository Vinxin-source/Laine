"use client";

import { getSupabase, isCloudEnabled } from "@/lib/supabase-client";

const MAX_BYTES = 2.5 * 1024 * 1024; // ~2.5MB — keep localStorage safe

/**
 * Resolve a photo for yarn:
 * - Always supports local data-URL fallback (works offline, no keys)
 * - If cloud + logged in + storage bucket "yarn-photos" exists, uploads there
 */
export async function processYarnPhoto(file: File | null): Promise<string | undefined> {
  if (!file) return undefined;

  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be under 2.5MB. Compress or crop first.");
  }

  if (isCloudEnabled()) {
    const supabase = getSupabase();
    if (supabase) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${userData.user.id}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from("yarn-photos")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (!error) {
          const { data } = supabase.storage.from("yarn-photos").getPublicUrl(path);
          if (data?.publicUrl) return data.publicUrl;
        }
        // fall through to local data URL if bucket missing / RLS not set
      }
    }
  }

  return readAsDataURL(file);
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}
