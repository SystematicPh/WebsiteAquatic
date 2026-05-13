import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getUserProfile, requireUser } from "@/lib/auth";
import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const profile = await getUserProfile(user.id);
  const supabase = await createSupabaseServer();
  const { data: item } = await supabase.from("items").select("*").eq("id", id).maybeSingle();

  if (!item) {
    notFound();
  }

  return (
    <div className="shell py-12">
      <CheckoutForm item={item} profile={profile} />
    </div>
  );
}
