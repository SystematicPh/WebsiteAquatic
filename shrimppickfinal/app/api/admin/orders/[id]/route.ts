import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, profile } = await requireApiUser();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (order) {
    await supabase.from("order_history").insert({
      original_order_id: order.id,
      user_id: order.user_id,
      item_id: order.item_id,
      quantity: order.quantity,
      status: order.status,
      receipt_url: order.receipt_url,
      full_name: order.full_name,
      address: order.address,
      phone: order.phone,
      created_at: order.created_at,
      deleted_at: new Date().toISOString()
    });
  }

  await supabase.from("chats").delete().eq("order_id", id);
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
