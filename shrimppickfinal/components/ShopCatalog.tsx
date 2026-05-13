"use client";

import { useMemo, useState } from "react";
import { ItemCard } from "@/components/ItemCard";
import { Item } from "@/lib/types";

interface ShopCatalogProps {
  items: Item[];
  categories: string[];
}

export function ShopCatalog({ items, categories }: ShopCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesCategory = category === "All" || item.category === category;
        const needle = `${item.name} ${item.category}`.toLowerCase();
        return matchesCategory && needle.includes(query.toLowerCase());
      }),
    [category, items, query]
  );

  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <input
          className="input max-w-xl"
          placeholder="Search betta, guppy, koi, plants, tanks..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={category === value ? "btn-primary" : "btn-secondary"}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
