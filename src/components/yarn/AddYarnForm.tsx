"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createYarn, findSimilarLocal } from "@/lib/yarn-repo";
import { processYarnPhoto } from "@/lib/photos";
import type { Yarn, YarnWeight } from "@/types";
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

export function AddYarnForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [similar, setSimilar] = useState<Yarn[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  function checkSimilar() {
    const name = (document.getElementById("yarn-name") as HTMLInputElement)?.value || "";
    const brand = (document.getElementById("brand") as HTMLInputElement)?.value || "";
    const colorway = (document.getElementById("colorway") as HTMLInputElement)?.value || "";
    setSimilar(findSimilarLocal({ name, brand, colorway }));
  }

  async function onFileChange(file: File | null) {
    setError("");
    setPreview(null);
    if (!file) return;
    try {
      const url = await processYarnPhoto(file);
      if (url) setPreview(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not use that image.");
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const name = String(form.get("name") || "").trim();
    const brand = String(form.get("brand") || "").trim() || undefined;
    const colorway = String(form.get("colorway") || "").trim() || undefined;

    const matches = findSimilarLocal({ name, brand, colorway });
    if (matches.length > 0) {
      const ok = confirm(
        `You may already own this (${matches.length} similar). Add anyway?`
      );
      if (!ok) {
        setSaving(false);
        setSimilar(matches);
        return;
      }
    }

    let photoUrl = preview || undefined;
    const file = (form.get("photoFile") as File | null) || null;
    if (file && file.size > 0 && !photoUrl) {
      try {
        photoUrl = await processYarnPhoto(file);
      } catch (err) {
        setSaving(false);
        setError(err instanceof Error ? err.message : "Photo failed");
        return;
      }
    }

    try {
      await createYarn({
        name,
        brand,
        colorway,
        weight: String(form.get("weight") || "dk") as YarnWeight,
        fiber: String(form.get("fiber") || "").trim() || undefined,
        quantity: Number(form.get("quantity") || 1),
        yardagePerSkein: form.get("yardage") ? Number(form.get("yardage")) : undefined,
        location: String(form.get("location") || "").trim() || undefined,
        photoUrl,
        notes: undefined,
      });
      router.push("/stash");
      router.refresh();
    } catch {
      setError("Could not save yarn.");
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4 animate-fade-up" onSubmit={onSubmit}>
      <Input
        id="yarn-name"
        name="name"
        label="Yarn name"
        placeholder="e.g. Sunday"
        required
        onBlur={checkSimilar}
      />
      <Input id="brand" name="brand" label="Brand" placeholder="e.g. Sandnes Garn" onBlur={checkSimilar} />
      <Input id="colorway" name="colorway" label="Colorway" placeholder="e.g. Natural" onBlur={checkSimilar} />

      {similar.length > 0 ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--primary-soft)] p-3 text-sm text-[var(--primary)]">
          Possible match already in your stash:{" "}
          {similar
            .slice(0, 3)
            .map((y) => [y.brand, y.name, y.colorway].filter(Boolean).join(" "))
            .join(" · ")}
        </div>
      ) : null}

      <Select name="weight" label="Weight" options={weights} defaultValue="dk" />
      <Input name="fiber" label="Fiber" placeholder="e.g. Merino wool" />
      <div className="grid grid-cols-2 gap-4">
        <Input name="quantity" label="Quantity" type="number" min={0} step="0.5" defaultValue="1" />
        <Input name="yardage" label="Yards / skein" type="number" min={0} />
      </div>
      <Input name="location" label="Location" placeholder="e.g. Hall closet, bin 2" />

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
          Photo
        </label>
        <input
          name="photoFile"
          type="file"
          accept="image/*"
          capture="environment"
          className="block w-full text-sm text-[var(--text-secondary)] file:mr-3 file:rounded-[var(--radius-sm)] file:border-0 file:bg-[var(--primary-soft)] file:px-3 file:py-1.5 file:text-sm file:text-[var(--primary)]"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          From camera or library · under 2.5MB · on device until cloud is connected
        </p>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="mt-3 h-28 w-28 rounded-[var(--radius-md)] object-cover border border-[var(--border)]"
          />
        ) : null}
      </div>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save yarn"}
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
