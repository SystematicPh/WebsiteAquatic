import { createSupabaseServer } from "@/lib/supabaseServer";
import { DashboardMetric, Item, Order, Review, UserProfile } from "@/lib/types";

export async function getFeaturedItems() {
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false });
    return (data ?? []) as Item[];
  } catch {
    return [];
  }
}

export async function getAllItems() {
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase.from("items").select("*").order("created_at", { ascending: false });
    return (data ?? []) as Item[];
  } catch {
    return [];
  }
}

export async function getReviews() {
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    return (data ?? []) as Review[];
  } catch {
    return [];
  }
}

export async function getCategories() {
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase.from("categories").select("*").order("name");
    return (data ?? []) as { id: string; name: string }[];
  } catch {
    return [];
  }
}

export async function getOrderById(orderId: string) {
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("orders")
      .select("*, items(*), users(*)")
      .eq("id", orderId)
      .maybeSingle();

    return data as Order | null;
  } catch {
    return null;
  }
}

export async function getUserOrders(userId: string) {
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("orders")
      .select("*, items(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return (data ?? []) as Order[];
  } catch {
    return [];
  }
}

export async function getOrderMessages(orderId: string) {
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("chats")
      .select("*, users(id, email, full_name, is_admin)")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAdminOrders() {
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from("orders")
      .select("*, items(*), users(*)")
      .order("created_at", { ascending: false });

    return (data ?? []) as Order[];
  } catch {
    return [];
  }
}

export async function getUsers() {
  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    return (data ?? []) as UserProfile[];
  } catch {
    return [];
  }
}

export async function getIncomeMetrics(): Promise<{
  stats: Record<string, number>;
  chart: DashboardMetric[];
}> {
  const orders = await getAdminOrders();
  const complete = orders.filter((order) => order.status === "Completed");

  const ranges = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    yearly: 365
  };

  const now = Date.now();

  const stats = Object.fromEntries(
    Object.entries(ranges).map(([key, days]) => {
      const sum = complete.reduce((total, order) => {
        const diff = (now - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24);
        return diff <= days ? total + (order.items?.price ?? 0) * order.quantity : total;
      }, 0);

      return [key, sum];
    })
  );

  const chartMap = new Map<string, number>();
  complete.forEach((order) => {
    const label = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" }).format(
      new Date(order.created_at)
    );
    chartMap.set(label, (chartMap.get(label) ?? 0) + (order.items?.price ?? 0) * order.quantity);
  });

  return {
    stats,
    chart: [...chartMap.entries()].map(([label, amount]) => ({ label, amount }))
  };
}
