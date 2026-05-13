import { AdminAnalyticsChart } from "@/components/AdminAnalyticsChart";
import { getAdminOrders, getIncomeMetrics, getUsers } from "@/lib/api";
import { currency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [users, orders, income] = await Promise.all([getUsers(), getAdminOrders(), getIncomeMetrics()]);

  const cards = [
    { label: "Total Users", value: users.length, plain: true },
    { label: "Total Orders", value: orders.length, plain: true },
    { label: "Daily Income", value: income.stats.daily },
    { label: "Weekly Income", value: income.stats.weekly },
    { label: "Monthly Income", value: income.stats.monthly },
    { label: "Yearly Income", value: income.stats.yearly }
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Admin overview</p>
        <h1 className="section-title mt-2">Store analytics</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="card p-6">
            <p className="text-sm text-ink/55">{card.label}</p>
            <p className="mt-4 font-display text-4xl">{card.plain ? card.value : currency(card.value)}</p>
          </div>
        ))}
      </div>

      <AdminAnalyticsChart data={income.chart} />
    </div>
  );
}
