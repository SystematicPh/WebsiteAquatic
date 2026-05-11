"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { Item } from "@/lib/types";
import { currency, slugifyFileName } from "@/lib/utils";

interface AdminItemsManagerProps {
  initialItems: Item[];
  categories: string[];
}

const emptyForm = {
  id: "",
  name: "",
  price: "",
  quantity: "",
  category: "",
  featured: false
};

export function AdminItemsManager({ initialItems, categories }: AdminItemsManagerProps) {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setForm(emptyForm);
    setFile(null);
  };

  const save = async () => {
    setBusy(true);
    let imageUrl = items.find((item) => item.id === form.id)?.image ?? "";

    if (file) {
      const filePath = `${Date.now()}-${slugifyFileName(file.name)}`;
      const upload = await supabase.storage.from("items").upload(filePath, file, { upsert: true });
      if (!upload.error) {
        imageUrl = supabase.storage.from("items").getPublicUrl(upload.data.path).data.publicUrl;
      }
    }

    const response = await fetch(form.id ? `/api/admin/items/${form.id}` : "/api/admin/items", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        image: imageUrl,
        price: Number(form.price),
        quantity: Number(form.quantity),
        category: form.category,
        featured: form.featured
      })
    });

    const payload = await response.json();
    if (response.ok) {
      setItems((current) =>
        form.id ? current.map((item) => (item.id === payload.item.id ? payload.item : item)) : [payload.item, ...current]
      );
      reset();
    }

    setBusy(false);
  };

  const edit = (item: Item) => {
    setForm({
      id: item.id,
      name: item.name,
      price: String(item.price),
      quantity: String(item.quantity),
      category: item.category,
      featured: item.featured
    });
  };

  const remove = async (itemId: string) => {
    const response = await fetch(`/api/admin/items/${itemId}`, { method: "DELETE" });
    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== itemId));
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="card space-y-4 p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Item editor</p>
          <h2 className="mt-2 font-display text-3xl">{form.id ? "Edit item" : "Add new item"}</h2>
        </div>
        <input className="input" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="input" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        </div>
        <input
          className="input"
          list="item-categories"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <datalist id="item-categories">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
        <input type="file" accept="image/*" className="input file:mr-4 file:rounded-full file:border-0 file:bg-foam file:px-4 file:py-2 file:text-sm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured on landing page
        </label>
        <div className="flex gap-3">
          <button type="button" className="btn-primary" onClick={save} disabled={busy}>
            {busy ? "Saving..." : form.id ? "Update Item" : "Create Item"}
          </button>
          <button type="button" className="btn-secondary" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="card flex gap-4 p-4">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[20px]">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl">{item.name}</h3>
                  <p className="text-sm text-ink/60">
                    {item.category} | Stock {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-coral">{currency(item.price)}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button type="button" className="btn-secondary !px-4 !py-2" onClick={() => edit(item)}>
                  Edit
                </button>
                <button type="button" className="btn-secondary !px-4 !py-2 text-coral" onClick={() => remove(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
