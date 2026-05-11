import Image from "next/image";
import Link from "next/link";
import { Item } from "@/lib/types";
import { currency } from "@/lib/utils";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="card overflow-hidden">
      <div className="relative h-56">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl">{item.name}</h3>
            <p className="mt-1 text-sm text-ink/60">{item.category}</p>
          </div>
          <p className="text-lg font-semibold text-coral">{currency(item.price)}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-ink/70">
          <span>Stock: {item.quantity}</span>
          <span>{item.quantity > 0 ? "Available" : "Out of stock"}</span>
        </div>
        <Link href={`/checkout/${item.id}`} className="btn-primary w-full">
          Order Now
        </Link>
      </div>
    </article>
  );
}
