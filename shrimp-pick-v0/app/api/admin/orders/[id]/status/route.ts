import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, profile } = await requireApiUser();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await request.json();

  const { error } = await supabase.from("orders").update({ status: body.status }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
