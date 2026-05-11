import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";

export async function POST(request: Request) {
  const { supabase, user } = await requireApiUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { data: item } = await supabase.from("items").select("*").eq("id", body.itemId).maybeSingle();

  if (!item) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  if (item.quantity < 1) {
    return NextResponse.json({ error: "Item is out of stock." }, { status: 400 });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      item_id: body.itemId,
      quantity: body.quantity ?? 1,
      status: "Noted",
      receipt_url: body.receiptUrl,
      full_name: body.fullName,
      address: body.address,
      phone: body.phone
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabase
    .from("items")
    .update({ quantity: Math.max(0, item.quantity - (body.quantity ?? 1)) })
    .eq("id", body.itemId);

  await supabase.from("chats").insert({
    order_id: order.id,
    sender_id: user.id,
    message: "Order submitted successfully. Please let us know if you need any changes."
  });

  return NextResponse.json({ orderId: order.id });
}
