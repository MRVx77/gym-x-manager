"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";

type NotificationSchema = {
  id: string;
  type: "EXPIRY_REMINDER" | "HOLIDAY" | "OFFER" | "EVENT" | "MAINTENANCE";
  message: string;
  sentAt: string;
  memberId: string | null;
  memberName: string | null;
};

type Member = {
  id: string;
  name: string;
};

const TYPE_LABEL: Record<NotificationSchema["type"], string> = {
  EXPIRY_REMINDER: "Expiry Reminder",
  HOLIDAY: "Holiday",
  OFFER: "Offer",
  EVENT: "Event",
  MAINTENANCE: "Maintenance",
};

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition [&>option]:bg-[#0a0a0f]";
const labelClass = "block text-sm font-medium text-white/60 mb-1.5";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationSchema[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [memberId, setMemberId] = useState("");
  const [type, setType] = useState<NotificationSchema["type"]>("HOLIDAY");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function loadNotifications() {
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data.notifications);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await api.get("/api/member/all-members");
        setMembers(res.data.members);
      } catch (error: any) {
        //member list failing isn't fatal — the broadcast option still works
      }
    }
    loadNotifications();
    loadMembers();
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);

    try {
      await api.post("/api/notifications", {
        type,
        message,
        ...(memberId ? { memberId } : {}),
      });
      setMessage("");
      setSuccess(
        memberId
          ? "Notification set to member"
          : "Notification broadcast to all members",
      );
      await loadNotifications();
    } catch (error: any) {
      setError(error.response?.data?.message || "something went wrong");
    } finally {
      setSending(false);
    }
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="mb-8 max-w-xl space-y-5 bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white">
          Send a notification
        </h2>

        <div>
          <label htmlFor="recipient" className={labelClass}>
            Send to
          </label>
          <select
            id="recipient"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className={inputClass}
          >
            <option value="">All members (broadcast)</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className={labelClass}>
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) =>
              setType(e.target.value as NotificationSchema["type"])
            }
            className={inputClass}
          >
            {Object.entries(TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <textarea
            id="message"
            rows={3}
            value={message}
            placeholder="e.g. The gym will be closed on 26th Jan for Republic Day."
            onChange={(e) => setMessage(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={sending || message.trim().length < 3}
          className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>

      <h2 className="text-lg font-semibold text-white mb-4">Sent history</h2>

      {loading ? (
        <p className="text-white/40">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-white/40">Nothing sent yet.</p>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 border-b border-white/10">
                <th className="px-6 py-3 font-medium">Message</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">To</th>
                <th className="px-6 py-3 font-medium">Sent</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr
                  key={n.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-6 py-4 text-white max-w-sm">{n.message}</td>
                  <td className="px-6 py-4 text-white/60">
                    {TYPE_LABEL[n.type]}
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {n.memberName ?? "All members"}
                  </td>
                  <td className="px-6 py-4 text-white/40">
                    {new Date(n.sentAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
