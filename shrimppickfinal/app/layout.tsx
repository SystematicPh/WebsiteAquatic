import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { getSessionUser } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export const metadata: Metadata = {
  title: "AquaNation SHOP",
  description: "Ornamental aquarium fish ecommerce built with Next.js and Supabase."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body>
        <header className="sticky top-4 z-40">
          <div className="shell flex h-20 items-center justify-between gap-4 rounded-full border border-white/70 bg-white/85 px-5 shadow-soft backdrop-blur">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full bg-white shadow-lg shadow-seaweed/20">
                <Image src="/aquanation-logo.png" alt="AquaNation SHOP logo" fill className="object-cover" priority />
              </div>
              <div>
                <p className="font-display text-2xl font-bold leading-none text-seaweed">AquaNation SHOP</p>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/45">Ornamental fish</p>
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
