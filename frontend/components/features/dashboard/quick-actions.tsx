"use client";

import { motion } from "framer-motion";
import { Bell, CreditCard, UserPlus } from "lucide-react";
import Link from "next/link";

const ACTIONS = [
  {
    id: "add-member",
    label: "Add Member",
    icon: UserPlus,
    href: "/dashboard/members/new",
    primary: true,
  },
  {
    id: "record-payment",
    label: "Record Payment",
    icon: CreditCard,
    href: "/dashboard/members", // lands on members list; full payment flow TBD
    primary: false,
  },
  {
    id: "send-notification",
    label: "Send Notification",
    icon: Bell,
    href: "/dashboard/notifications",
    primary: false,
  },
] as const;

interface QuickActionsProps {
  variants?: object;
}

export function QuickActions({ variants }: QuickActionsProps) {
  return (
    <motion.div
      variants={variants}
      className="flex flex-wrap items-center gap-3"
    >
      {ACTIONS.map(({ id, label, icon: Icon, href, primary }) =>
        primary ? (
          <Link
            key={id}
            id={id}
            href={href}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 shadow-lg shadow-purple-900/30 transition-all duration-200 hover:shadow-purple-700/40"
          >
            <Icon size={15} />
            {label}
          </Link>
        ) : (
          <Link
            key={id}
            id={id}
            href={href}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <Icon size={15} />
            {label}
          </Link>
        ),
      )}
    </motion.div>
  );
}
