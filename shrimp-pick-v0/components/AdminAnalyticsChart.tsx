"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardMetric } from "@/lib/types";
import { currency } from "@/lib/utils";

export function AdminAnalyticsChart({ data }: { data: DashboardMetric[] }) {
  return (
    <div className="card h-[360px] p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Income trend</p>
      <h3 className="mt-2 font-display text-3xl">Completed order revenue</h3>
      <div className="mt-6 h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EE6C4D" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#EE6C4D" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#d6ddd8" strokeDasharray="4 4" />
            <XAxis dataKey="label" tick={{ fill: "#516165", fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `PHP ${value}`} tick={{ fill: "#516165", fontSize: 12 }} />
            <Tooltip formatter={(value: number) => currency(value)} />
            <Area type="monotone" dataKey="amount" stroke="#EE6C4D" fill="url(#income)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
