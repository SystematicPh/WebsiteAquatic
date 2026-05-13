"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

type Mode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const [mode, setMode] = useState<Mode>("signin");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (formData: FormData) => {
    setBusy(true);
    setError(null);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("full_name") ?? "");
    const address = String(formData.get("address") ?? "");
    const phone = String(formData.get("phone") ?? "");

    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                address,
                phone
              }
            }
          });

    if (result.error) {
      setError(result.error.message);
      setBusy(false);
      return;
    }

    router.push(searchParams.get("redirectedFrom") || "/shop");
    router.refresh();
  };

  return (
    <div className="card mx-auto w-full max-w-xl p-8">
      <div className="mb-8 flex gap-2 rounded-full bg-foam p-2">
        <button
          className={mode === "signin" ? "btn-primary flex-1" : "btn-secondary flex-1 bg-transparent"}
          type="button"
          onClick={() => setMode("signin")}
        >
          Sign In
        </button>
        <button
          className={mode === "signup" ? "btn-primary flex-1" : "btn-secondary flex-1 bg-transparent"}
          type="button"
          onClick={() => setMode("signup")}
        >
          Create Account
        </button>
      </div>

      <form action={onSubmit} className="space-y-4">
        {mode === "signup" && (
          <>
            <div className="space-y-2">
              <label className="label">Full Name</label>
              <input name="full_name" className="input" placeholder="Juan Dela Cruz" required />
            </div>
            <div className="space-y-2">
              <label className="label">Address</label>
              <input name="address" className="input" placeholder="Barangay, City, Province" required />
            </div>
            <div className="space-y-2">
              <label className="label">Phone Number</label>
              <input name="phone" className="input" placeholder="+63 912 345 6789" required />
            </div>
          </>
        )}
        <div className="space-y-2">
          <label className="label">Email</label>
          <input name="email" type="email" className="input" placeholder="customer@aquaticshop.com" required />
        </div>
        <div className="space-y-2">
          <label className="label">Password</label>
          <input name="password" type="password" className="input" placeholder="Minimum 6 characters" required />
        </div>

        {error && <p className="rounded-2xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "Please wait..." : mode === "signin" ? "Enter Shop" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
