import { AdminItemsManager } from "@/components/AdminItemsManager";
import { getAllItems, getCategories } from "@/lib/api";

export default async function AdminItemsPage() {
  const [items, categories] = await Promise.all([getAllItems(), getCategories()]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Catalog management</p>
        <h1 className="section-title mt-2">Create and curate inventory</h1>
      </div>
      <AdminItemsManager initialItems={items} categories={categories.map((category) => category.name)} />
    </div>
  );
}
