import { redirect } from "next/navigation";
import { cache } from "react";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { UserProfile } from "@/lib/types";

export const getSessionUser = cache(async () => {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    return user;
  } catch {
    return null;
  }
});

export const requireUser = cache(async () => {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return user;
});

export const getUserProfile = cache(async (userId?: string) => {
  try {
    const supabase = await createSupabaseServer();
    const activeUserId = userId ?? (await requireUser()).id;
    const { data } = await supabase.from("users").select("*").eq("id", activeUserId).maybeSingle();
    return data as UserProfile | null;
  } catch {
    return null;
  }
});

export const requireAdmin = cache(async () => {
  const profile = await getUserProfile();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  return profile;
});
