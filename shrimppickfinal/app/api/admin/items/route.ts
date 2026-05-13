import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";

export async function POST(request: Request) {
  const { supabase, profile } = await requireApiUser();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();

  const { data: item, error } = await supabase.from("items").insert(body).select("*").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await supabase.from("categories").upsert({ name: body.category }, { onConflict: "name" });

  return NextResponse.json({ item });
}
