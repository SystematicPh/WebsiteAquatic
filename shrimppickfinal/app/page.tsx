import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Carousel } from "@/components/Carousel";
import { ItemCard } from "@/components/ItemCard";
import { getFeaturedItems, getReviews } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";

export default async function LandingPage() {
  const [featuredItems, reviews, user] = await Promise.all([getFeaturedItems(), getReviews(), getSessionUser()]);

  return (
    <div className="shell space-y-16 py-10">
      <Hero signedIn={!!user} />

      <section id="popular" className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Hero 2</p>
            <h2 className="section-title mt-2">Popular Items</h2>
            <p className="section-copy mt-3">
              Featured fish and aquarium supplies are pulled directly from Supabase, so the landing page stays synced with live inventory.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Hero 3</p>
          <h2 className="section-title mt-2">Customer Reviews</h2>
          <p className="section-copy mt-3">
            Admin-managed review images flow into this continuously moving carousel for social proof on the storefront.
          </p>
        </div>
        <Carousel reviews={reviews} />
      </section>

      <section className="card flex flex-col items-start justify-between gap-8 p-8 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Connect with us</p>
          <h2 className="section-title mt-2">Social Section</h2>
          <p className="section-copy mt-3">
            Placeholder links are wired in now, and your admin can swap in the real destinations later.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="https://instagram.com" target="_blank" className="btn-secondary">
            <Instagram className="mr-2 h-4 w-4" />
            Instagram
          </Link>
          <Link href="https://facebook.com" target="_blank" className="btn-secondary">
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </Link>
        </div>
      </section>
    </div>
  );
}
