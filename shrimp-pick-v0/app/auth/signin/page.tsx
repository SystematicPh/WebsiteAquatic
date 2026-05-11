import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <div className="shell py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-ink/45">Authentication</p>
        <h1 className="mt-2 font-display text-5xl">Welcome back to Shrimp Pick</h1>
        <p className="mt-4 text-base text-ink/65">
          Sign in to order, upload receipts, and chat with the team in real time.
        </p>
      </div>
      <Suspense>
        <AuthForm />
      </Suspense>
    </div>
  );
}
