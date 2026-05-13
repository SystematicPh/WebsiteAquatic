import { ShopCatalog } from "@/components/ShopCatalog";
import { getAllItems, getCategories } from "@/lib/api";

export default async function ShopPage() {
  const [items, categories] = await Promise.all([getAllItems(), getCategories()]);

  return (
    <div className="shell space-y-8 py-12">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Aquarium storefront</p>
        <h1 className="section-title mt-2">Shop ornamental fish and aquatic essentials</h1>
        <p className="section-copy mt-3">
          Search, filter by category, and move straight into checkout with the selected fish or supply already bound to the order.
        </p>
      </div>
      <ShopCatalog items={items} categories={categories.map((category) => category.name)} />
    </div>
  );
}
