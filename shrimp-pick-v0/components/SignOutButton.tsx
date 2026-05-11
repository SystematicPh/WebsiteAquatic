"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export function SignOutButton() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowser(), []);

  return (
    <button
      type="button"
      className="btn-secondary"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/auth/signin");
        router.refresh();
      }}
    >
      Logout
    </button>
  );
}
