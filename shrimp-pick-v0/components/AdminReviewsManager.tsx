"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { Review } from "@/lib/types";
import { slugifyFileName } from "@/lib/utils";

export function AdminReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const [reviews, setReviews] = useState(initialReviews);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    const path = `${Date.now()}-${slugifyFileName(file.name)}`;
    const result = await supabase.storage.from("reviews").upload(path, file, { upsert: true });
    if (result.error) {
      setBusy(false);
      return;
    }

    const publicUrl = supabase.storage.from("reviews").getPublicUrl(result.data.path).data.publicUrl;
    const response = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: publicUrl })
    });
    const payload = await response.json();
    if (response.ok) {
      setReviews((current) => [payload.review, ...current]);
    }
    setBusy(false);
  };

  const remove = async (id: string) => {
    const response = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (response.ok) {
      setReviews((current) => current.filter((review) => review.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Carousel manager</p>
        <h2 className="mt-2 font-display text-3xl">Upload customer review images</h2>
        <input
          type="file"
          accept="image/*"
          className="input mt-6 file:mr-4 file:rounded-full file:border-0 file:bg-foam file:px-4 file:py-2 file:text-sm"
          onChange={(event) => upload(event.target.files?.[0] ?? null)}
          disabled={busy}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="card overflow-hidden">
            <div className="relative h-64">
              <Image src={review.image_url} alt="Customer review asset" fill className="object-cover" />
            </div>
            <div className="p-4">
              <button type="button" className="btn-secondary w-full text-coral" onClick={() => remove(review.id)}>
                Delete Image
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
