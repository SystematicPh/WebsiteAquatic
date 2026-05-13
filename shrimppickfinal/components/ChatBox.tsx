"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { ChatMessage, Order, UserProfile } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

interface ChatBoxProps {
  order: Order;
  initialMessages: ChatMessage[];
  currentUser: UserProfile;
}

export function ChatBox({ order, initialMessages, currentUser }: ChatBoxProps) {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chats", filter: `order_id=eq.${order.id}` },
        async (payload) => {
          const { data } = await supabase
            .from("chats")
            .select("*, users(id, email, full_name, is_admin)")
            .eq("id", payload.new.id)
            .maybeSingle();

          if (data) {
            setMessages((current) => {
              const exists = current.some((message) => message.id === data.id);
              return exists ? current : [...current, data as ChatMessage];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id, supabase]);

  const sendMessage = async () => {
    if (!draft.trim()) return;
    setBusy(true);

    const response = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        message: draft
      })
    });

    if (response.ok) {
      setDraft("");
    }

    setBusy(false);
  };

  return (
    <div className="card flex min-h-[620px] flex-col overflow-hidden">
      <div className="border-b border-ink/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/45">Order support</p>
            <h2 className="mt-2 font-display text-3xl">{order.items?.name}</h2>
            <p className="mt-2 text-sm text-ink/65">
              {order.full_name} | {order.address} | {order.phone}
            </p>
          </div>
          <span
            className={cn(
              "status-pill",
              order.status === "Completed"
                ? "bg-seaweed/10 text-seaweed"
                : order.status === "Shipping"
                  ? "bg-tide/10 text-tide"
                  : "bg-coral/10 text-coral"
            )}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-white/50 p-6">
        {messages.map((message) => {
          const mine = message.sender_id === currentUser.id;
          return (
            <div key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-xl rounded-[24px] px-4 py-3 text-sm shadow-sm",
                  mine ? "bg-tide text-white" : "bg-white text-ink"
                )}
              >
                <p className="mb-1 text-xs font-semibold opacity-70">
                  {message.users?.full_name || message.users?.email || "Support"}
                </p>
                <p>{message.message}</p>
                <p className="mt-2 text-[11px] opacity-60">{formatDate(message.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-ink/10 bg-white p-4">
        <div className="flex gap-3">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="input"
            placeholder="Write a message to the order team..."
          />
          <button type="button" className="btn-primary shrink-0" onClick={sendMessage} disabled={busy}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
