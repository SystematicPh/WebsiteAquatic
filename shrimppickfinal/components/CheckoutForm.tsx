"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { Item, UserProfile } from "@/lib/types";
import { currency, slugifyFileName } from "@/lib/utils";

interface CheckoutFormProps {
  item: Item;
  profile: UserProfile | null;
}

export function CheckoutForm({ item, profile }: CheckoutFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = async (formData: FormData) => {
    setBusy(true);
    setError(null);

    const file = formData.get("receipt") as File | null;
    if (!file || !file.size) {
      setError("Receipt upload is required.");
      setBusy(false);
      return;
    }

    const fileName = `${profile?.id ?? "guest"}/${Date.now()}-${slugifyFileName(file.name)}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from("receipts").upload(fileName, file, {
      upsert: false
    });

    if (uploadError) {
      setError(uploadError.message);
      setBusy(false);
      return;
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from("receipts").getPublicUrl(uploadData.path);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: item.id,
        quantity: 1,
        fullName: formData.get("full_name"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        receiptUrl: publicUrl
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error || "Unable to create order.");
      setBusy(false);
      return;
    }

    setOpen(true);
    setBusy(false);
    setTimeout(() => {
      router.push(`/dashboard/order/${payload.orderId}`);
      router.refresh();
    }, 1800);
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card overflow-hidden">
          <div className="relative h-80">
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          </div>
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Selected item</p>
                <h1 className="mt-2 font-display text-4xl">{item.name}</h1>
              </div>
              <span className="text-2xl font-semibold text-coral">{currency(item.price)}</span>
            </div>
            <p className="text-sm text-ink/65">Category: {item.category}</p>
            <p className="text-sm text-ink/65">Available stock: {item.quantity}</p>
          </div>
        </div>

        <form action={submitOrder} className="card space-y-5 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Checkout</p>
            <h2 className="mt-2 font-display text-3xl">Finish your order</h2>
          </div>
          <div className="space-y-2">
            <label className="label">Item Name</label>
            <input className="input bg-foam" value={item.name} readOnly />
          </div>
          <div className="space-y-2">
            <label className="label">Full Name</label>
            <input name="full_name" className="input" defaultValue={profile?.full_name ?? ""} required />
          </div>
          <div className="space-y-2">
            <label className="label">Address</label>
            <textarea name="address" className="input min-h-28" defaultValue={profile?.address ?? ""} required />
          </div>
          <div className="space-y-2">
            <label className="label">Phone Number</label>
            <input name="phone" className="input" defaultValue={profile?.phone ?? ""} required />
          </div>
          <div className="rounded-[26px] border border-seaweed/10 bg-white/80 p-5 text-center">
            <p className="text-sm font-bold text-seaweed">Scan QR to pay</p>
            <p className="mt-1 text-xs text-ink/55">Attach your payment receipt below after completing payment.</p>
            <div className="relative mx-auto mt-4 h-52 w-52 overflow-hidden rounded-[24px] border border-seaweed/10 bg-foam">
              <Image src="/qr-placeholder.svg" alt="Payment QR placeholder" fill className="object-cover" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label">Receipt Upload</label>
            <input name="receipt" type="file" accept="image/*,.pdf" className="input file:mr-4 file:rounded-full file:border-0 file:bg-foam file:px-4 file:py-2 file:text-sm" required />
          </div>
          {error && <p className="rounded-2xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? "Submitting order..." : "Submit Order"}
          </button>
        </form>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-ink/60" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-6 shadow-soft">
            <Dialog.Title className="font-display text-3xl font-bold">Order submitted</Dialog.Title>
            <p className="mt-2 text-sm text-ink/65">Your receipt was attached. We are opening your live chat room.</p>
            <div className="relative mx-auto mt-6 h-56 w-56 overflow-hidden rounded-[28px] border border-ink/10">
              <Image src="/qr-placeholder.svg" alt="QR placeholder" fill className="object-cover" />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
