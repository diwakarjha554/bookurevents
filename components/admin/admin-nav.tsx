"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard, Inbox, Mail, MessageSquare, Users, CalendarDays, Wallet, Menu, X,
} from "lucide-react";

const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/contacts", label: "Contacts", icon: Inbox },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
    { href: "/admin/agents", label: "Agents", icon: Users },
    { href: "/admin/events", label: "Events", icon: CalendarDays },
    { href: "/admin/payments", label: "Payments", icon: Wallet },
];

export default function AdminNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isActive = (href: string) =>
        href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

    const list = (
        <nav className="flex flex-col gap-1">
            {links.map((l) => {
                const active = isActive(l.href);
                return (
                    <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition-colors ${
                            active
                                ? "bg-[rgba(212,175,55,0.12)] text-gold"
                                : "text-ivory-soft hover:bg-white/5 hover:text-ivory"
                        }`}
                    >
                        <l.icon className="h-4 w-4" />
                        {l.label}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div className="flex items-center justify-between border-b border-[rgba(212,175,55,0.16)] p-4 lg:hidden">
                <span className="font-display text-lg text-gold">Admin</span>
                <button onClick={() => setOpen((o) => !o)} className="text-ivory" aria-label="Toggle menu">
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
            {open && <div className="border-b border-[rgba(212,175,55,0.16)] p-4 lg:hidden">{list}</div>}

            {/* Desktop sidebar list */}
            <div className="hidden lg:block">{list}</div>
        </>
    );
}
