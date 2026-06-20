"use client";

import DataTable, { type Column } from "@/components/admin/data-table";
import { Mail } from "lucide-react";

export type SubscriberRow = {
    id: string;
    email: string;
    createdAt: string;
};

const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function NewsletterTable({ rows }: { rows: SubscriberRow[] }) {
    const columns: Column<SubscriberRow>[] = [
        {
            key: "email", header: "Email", sortable: true,
            render: (r) => (
                <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 text-ivory hover:text-gold">
                    <Mail className="h-3.5 w-3.5 text-gold" /> {r.email}
                </a>
            ),
        },
        {
            key: "createdAt", header: "Subscribed", sortable: true, value: (r) => r.createdAt,
            render: (r) => <span className="whitespace-nowrap text-ivory-soft">{fmt(r.createdAt)}</span>,
        },
    ];

    return (
        <DataTable
            rows={rows}
            columns={columns}
            exportName="newsletter-subscribers"
            exportTitle="Newsletter Subscribers"
            searchPlaceholder="Search subscribers..."
            getRowKey={(r) => r.id}
        />
    );
}
