import { AdminUsersTable } from "@/components/AdminUsersTable";
import { getUsers } from "@/lib/api";

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-ink/45">User management</p>
        <h1 className="section-title mt-2">Customer accounts</h1>
      </div>
      <AdminUsersTable users={users} />
    </div>
  );
}
