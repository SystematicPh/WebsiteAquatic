import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/items", label: "Items" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/users", label: "Users" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="shell py-10">
      <div className="mb-8 flex flex-wrap gap-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="btn-secondary">
            {link.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
