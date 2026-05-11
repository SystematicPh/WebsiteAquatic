import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  signedIn: boolean;
}

export function Hero({ signedIn }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden rounded-[36px] bg-cover bg-center px-6 py-24 text-white sm:px-10 lg:px-16"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(13,27,30,0.7), rgba(27,73,101,0.45)), url('https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=1600&q=80')"
      }}
    >
      <div className="max-w-3xl">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/75">Fresh seafood marketplace</p>
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">Shrimp Pick</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
          Premium shrimp, straight from trusted suppliers to your table. Browse stocked items, upload payment
          receipts, and stay updated through live order chat.
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
