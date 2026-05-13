"use client";

import { useMemo, useState } from "react";
import { UserProfile } from "@/lib/types";

export function AdminUsersTable({ users }: { users: UserProfile[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return users.filter((user) =>
      `${user.full_name ?? ""} ${user.email}`.toLowerCase().includes(needle)
    );
  }, [query, users]);

  return (
    <div className="space-y-5">
      <input
        className="input max-w-lg"
        placeholder="Search by name or email"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="grid gap-4">
        {filtered.map((user) => (
          <div key={user.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl">{user.full_name || "Unnamed account"}</h3>
                <p className="mt-1 text-sm text-ink/60">{user.email}</p>
              </div>
              <span className={user.is_admin ? "status-pill bg-seaweed/10 text-seaweed" : "status-pill bg-foam text-ink"}>
                {user.is_admin ? "Admin" : "Customer"}
              </span>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-ink/70 sm:grid-cols-2">
              <p>Address: {user.address || "Not set"}</p>
              <p>Phone: {user.phone || "Not set"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
