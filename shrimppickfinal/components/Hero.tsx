import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  signedIn: boolean;
}

export function Hero({ signedIn }: HeroProps) {
  return (
    <section
      className="relative min-h-[560px] overflow-hidden rounded-[34px] bg-cover bg-center px-6 py-24 text-white shadow-soft sm:px-10 lg:px-16"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(25,38,23,0.72), rgba(63,127,47,0.28)), url('https://images.unsplash.com/photo-1520301255226-bf5f144451c1?auto=format&fit=crop&w=1600&q=80')"
      }}
    >
      <div className="max-w-3xl pt-12">
        <p className="mb-4 inline-flex rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-seaweed shadow-soft">
          Ornamental aquarium fish store
        </p>
        <h1 className="font-display text-5xl font-black leading-tight sm:text-6xl">AquaNation SHOP</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
          Shop healthy ornamental fish, aquatic plants, and aquarium essentials. Browse live inventory, upload payment
          receipts, and coordinate care or delivery details through live order chat.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href={signedIn ? "/shop" : "/auth/signin"} className="btn-primary">
            View Shop
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a href="#popular" className="btn-secondary border-white/20 bg-white/10 text-white hover:text-white">
            Explore Popular Items
          </a>
        </div>
      </div>
    </section>
  );
}
