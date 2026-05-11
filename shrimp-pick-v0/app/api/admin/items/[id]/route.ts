import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, profile } = await requireApiUser();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await request.json();
  const { data: item, error } = await supabase.from("items").update(body).eq("id", id).select("*").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabase.from("categories").upsert({ name: body.category }, { onConflict: "name" });

  return NextResponse.json({ item });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, profile } = await requireApiUser();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
