import { AdminOrdersTable } from "@/components/AdminOrdersTable";
import { getAdminOrders } from "@/lib/api";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Order management</p>
        <h1 className="section-title mt-2">Review and update live orders</h1>
      </div>
      <AdminOrdersTable initialOrders={orders} />
    </div>
  );
}
