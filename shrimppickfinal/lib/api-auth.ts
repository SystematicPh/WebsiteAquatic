import { createSupabaseServer } from "@/lib/supabaseServer";

export async function requireApiUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null };
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();

  return { supabase, user, profile };
}
