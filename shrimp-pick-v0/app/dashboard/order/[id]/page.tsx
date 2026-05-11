import { notFound } from "next/navigation";
import { ChatBox } from "@/components/ChatBox";
import { getOrderById, getOrderMessages } from "@/lib/api";
import { getUserProfile, requireUser } from "@/lib/auth";

export default async function OrderChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const profile = await getUserProfile(user.id);
  const [order, messages] = await Promise.all([getOrderById(id), getOrderMessages(id)]);

  if (!order) {
    notFound();
  }

  const canAccess = profile?.is_admin || order.user_id === user.id;
  if (!canAccess || !profile) {
    notFound();
  }

  return (
    <div className="shell py-12">
      <ChatBox order={order} initialMessages={messages} currentUser={profile} />
    </div>
  );
}
