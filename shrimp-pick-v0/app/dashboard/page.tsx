import Link from "next/link";
import { getUserOrders } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { currency, formatDate, getStatusClasses } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const orders = await getUserOrders(user.id);

  return (
    <div className="shell space-y-8 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Customer dashboard</p>
          <h1 className="section-title mt-2">Your order history</h1>
          <p className="section-copy mt-3">Track active orders and jump into the live chat thread for any order.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/dashboard/order/${order.id}`} className="card block p-6 transition hover:-translate-y-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl">{order.items?.name}</h2>
                <p className="mt-2 text-sm text-ink/60">
                  {currency((order.items?.price ?? 0) * order.quantity)} | {formatDate(order.created_at)}
                </p>
              </div>
              <span className={getStatusClasses(order.status)}>{order.status}</span>
            </div>
          </Link>
        ))}
        {!orders.length && <div className="card p-10 text-center text-ink/55">No orders yet. Visit the shop to place your first order.</div>}
      </div>
    </div>
  );
}
