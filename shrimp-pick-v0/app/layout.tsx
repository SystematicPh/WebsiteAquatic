import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ShoppingBasket } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export const metadata: Metadata = {
  title: "Shrimp Pick",
  description: "Production-ready seafood e-commerce built with Next.js and Supabase."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-40 border-b border-white/60 bg-sand/90 backdrop-blur">
          <div className="shell flex h-20 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white">
                <ShoppingBasket className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl leading-none">Shrimp Pick</p>
                <p className="text-xs uppercase tracking-[0.35em] text-ink/45">Fresh daily</p>
              </div>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-ink/70 md:flex">
              <Link href="/shop">Shop</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/admin/dashboard">Admin</Link>
            </nav>
            <div className="flex items-center gap-3">
              {user ? (
                <SignOutButton />
              ) : (
                <Link href="/auth/signin" className="btn-primary">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>
        <main className="pb-16">{children}</main>
      </body>
    </html>
  );
}
