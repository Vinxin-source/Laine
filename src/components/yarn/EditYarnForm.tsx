"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Yarn, YarnWeight } from "@/types";
import { getYarnById, patchYarn } from "@/lib/yarn-repo";
import { processYarnPhoto } from "@/lib/photos";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const weights = [
  { value: "lace", label: "Lace" },
  { value: "fingering", label: "Fingering" },
  { value: "sport", label: "Sport" },
  { value: "dk", label: "DK" },
  { value: "worsted", label: "Worsted" },
  { value: "aran", label: "Aran" },
  { value: "bulky", label: "Bulky" },
  { value: "super-bulky", label: "Super bulky" },
  { value: "jumbo", label: "Jumbo" },
];

export function EditYarnForm({ id }: { id: string }) {
  const router = useRouter();
  const [yarn, setYarn] = useState<Yarn | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    getYarnById(id).then((y) => {
      setYarn(y ?? null);
      if (y?.photoUrl) setPreview(y.photoUrl);
    });
  }, [id]);

  if (!yarn) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        Yarn not found.{" "}
        <Link href="/stash" className="text-[var(--primary)]">
          Back to stash
        </Link>
      </p>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(e.currentTarget);

    let photoUrl = preview || yarn.photoUrl;
    const file = (form.get("photoFile") as File | null) || null;
    if (file && file.size > 0) {
      try {
        photoUrl = await processYarnPhoto(file);
      } catch (err) {
        setSaving(false);
        setError(err instanceof Error ? err.message : "Photo failed");
        return;
      }
    }

    await patchYarn(id, {
      name: String(form.get("name") || "").trim(),
      brand: String(form.get("brand") || "").trim() || undefined,
      colorway: String(form.get("colorway") || "").trim() || undefined,
      weight: String(form.get("weight") || "dk") as YarnWeight,
      fiber: String(form.get("fiber") || "").trim() || undefined,
      quantity: Number(form.get("quantity") || 1),
      yardagePerSkein: form.get("yardage") ? Number(form.get("yardage")) : undefined,
      location: String(form.get("location") || "").trim() || undefined,
      photoUrl,
    });
    router.push("/stash");
    router.refresh();
  }

  return (
    <form className="space-y-4 animate-fade-up" onSubmit={onSubmit}>
      <Input name="name" label="Yarn name" defaultValue={yarn.name} required />
      <Input name="brand" label="Brand" defaultValue={yarn.brand || ""} />
      <Input name="colorway" label="Colorway" defaultValue={yarn.colorway || ""} />
      <Select name="weight" label="Weight" options={weights} defaultValue={yarn.weight} />
      <Input name="fiber" label="Fiber" defaultValue={yarn.fiber || ""} />
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="quantity"
          label="Quantity"
          type="number"
          min={0}
          step="0.5"
          defaultValue={String(yarn.quantity)}
        />
        <Input
          name="yardage"
          label="Yards / skein"
          type="number"
          min={0}
          defaultValue={yarn.yardagePerSkein ? String(yarn.yardagePerSkein) : ""}
        />
      </div>
      <Input name="location" label="Location" defaultValue={yarn.location || ""} />

      <div>
        <label className="block text-sm font-medium mb-1.5">Photo</label>
        <input
          name="photoFile"
          type="file"
          accept="image/*"
          capture="environment"
          className="block w-full text-sm text-[var(--text-secondary)] file:mr-3 file:rounded-[var(--radius-sm)] file:border-0 file:bg-[var(--primary-soft)] file:px-3 file:py-1.5 file:text-sm file:text-[var(--primary)]"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              setPreview((await processYarnPhoto(f)) || null);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Photo failed");
            }
          }}
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="mt-3 h-28 w-28 rounded-[var(--radius-md)] object-cover border border-[var(--border)]"
          />
        ) : null}
      </div>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <Link href="/stash">
          <Button variant="ghost" type="button">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
