import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";

export async function POST(request: Request) {
  const { supabase, user } = await requireApiUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { error } = await supabase.from("chats").insert({
    order_id: body.orderId,
    sender_id: user.id,
    message: body.message
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
