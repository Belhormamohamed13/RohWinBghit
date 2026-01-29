import { useEffect, useMemo, useRef, useState } from "react";

import { useGetMessagesByTripQuery, useSendMessageMutation } from "../../store/api/messagesApi";
import { useGetMyBookingsQuery } from "../../store/api/bookingsApi";
import { useMeQuery } from "../../store/api/usersApi";
import type { MessageDto } from "../../types/api";

type Props = {
  tripId: string;
  driverId: string;
};

export function TripMessagesPanel({ tripId, driverId }: Props) {
  const { data: meData } = useMeQuery();
  const me = meData?.data;

  const { data: myBookings } = useGetMyBookingsQuery();
  const bookingForTrip = useMemo(
    () => myBookings?.data?.find((b) => (typeof b.trip === "string" ? b.trip === tripId : b.trip._id === tripId)),
    [myBookings, tripId]
  );

  const isDriver = me && me.id === driverId;
  const isPassenger = !!bookingForTrip;

  const { data, isError } = useGetMessagesByTripQuery(tripId, {
    skip: !me || (!isDriver && !isPassenger)
  });
  const [sendMessage, sendState] = useSendMessageMutation();

  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const messages: MessageDto[] = data?.data ?? [];

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  if (!me || (!isDriver && !isPassenger)) {
    return null;
  }

  if (isError) {
    return null;
  }

  const receiverId = isPassenger ? driverId : undefined;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !receiverId) return;
    try {
      await sendMessage({ tripId, receiverId, content: content.trim() }).unwrap();
      setContent("");
    } catch {
      // handled by UI state
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">Messages du trajet</div>
      </div>

      <div className="mt-3 max-h-64 space-y-2 overflow-y-auto border-y border-slate-100 py-2 text-sm">
        {messages.map((m) => {
          const mine = m.sender === me.id;
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs rounded-2xl px-3 py-2 ${
                  mine ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                <div>{m.content}</div>
                <div className="mt-1 text-[10px] opacity-75">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {isPassenger && (
        <form onSubmit={handleSend} className="mt-3 flex gap-2">
          <input
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
            placeholder="Écrire un message au conducteur…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={sendState.isLoading}
          />
          <button
            type="submit"
            className="rounded-xl bg-brand-green px-3 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
            disabled={sendState.isLoading || !receiverId}
          >
            Envoyer
          </button>
        </form>
      )}
    </section>
  );
}

