"use client";

import { useState } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/lib/types";
import { currency, formatDate, getStatusClasses } from "@/lib/utils";

const statuses: OrderStatus[] = ["Noted", "Shipping", "Completed"];

export function AdminOrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));
    }
  };

  const removeOrder = async (orderId: string) => {
    const response = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
    if (response.ok) {
      setOrders((current) => current.filter((order) => order.id !== orderId));
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-foam text-ink/70">
            <tr>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Item</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Receipt</th>
              <th className="px-5 py-4">Ordered</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-ink/5">
                <td className="px-5 py-4">
                  <p className="font-semibold">{order.full_name}</p>
                  <p className="text-ink/55">{order.phone}</p>
                </td>
                <td className="px-5 py-4">
                  <p>{order.items?.name}</p>
                  <p className="text-ink/55">{currency((order.items?.price ?? 0) * order.quantity)}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={getStatusClasses(order.status)}>{order.status}</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        type="button"
                        key={status}
                        className={status === order.status ? "btn-primary !px-3 !py-2" : "btn-secondary !px-3 !py-2"}
                        onClick={() => updateStatus(order.id, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <a href={order.receipt_url} target="_blank" className="text-tide underline">
                    View receipt
                  </a>
                </td>
                <td className="px-5 py-4 text-ink/60">{formatDate(order.created_at)}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/dashboard/order/${order.id}`} className="text-tide underline">
                      Open chat
                    </Link>
                    <button type="button" className="text-coral underline" onClick={() => removeOrder(order.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/50">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
