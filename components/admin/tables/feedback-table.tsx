"use client";

import DataTable, { type Column } from "@/components/admin/data-table";
import { Star } from "lucide-react";

export type FeedbackRow = {
    id: string;
    name: string;
    email: string | null;
    rating: number | null;
    message: string;
    createdAt: string;
};

const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function Stars({ rating }: { rating: number | null }) {
    if (!rating) return <span className="text-ivory-soft">-</span>;
    return (
        <span className="inline-flex gap-0.5 whitespace-nowrap">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-gold text-gold" : "text-ivory-soft/30"}`} />
            ))}
        </span>
    );
}

export default function FeedbackTable({ rows }: { rows: FeedbackRow[] }) {
    const columns: Column<FeedbackRow>[] = [
        { key: "name", header: "Name", sortable: true, render: (r) => <span className="whitespace-nowrap font-medium text-ivory">{r.name}</span> },
        { key: "email", header: "Email", value: (r) => r.email ?? "", render: (r) => r.email ? <a href={`mailto:${r.email}`} className="text-ivory-soft hover:text-gold">{r.email}</a> : <span className="text-ivory-soft">-</span> },
        {
            key: "rating", header: "Rating", sortable: true, filterable: true,
            value: (r) => (r.rating ? `${r.rating}★` : ""),
            render: (r) => <Stars rating={r.rating} />,
        },
        {
            key: "message", header: "Message", value: (r) => r.message,
            render: (r) => <span className="block max-w-[26rem] truncate text-ivory-soft" title={r.message}>{r.message}</span>,
        },
        {
            key: "createdAt", header: "Date", sortable: true, value: (r) => r.createdAt,
            render: (r) => <span className="whitespace-nowrap text-ivory-soft">{fmt(r.createdAt)}</span>,
        },
    ];

    return (
        <DataTable
            rows={rows}
            columns={columns}
            exportName="feedback"
            exportTitle="Feedback"
            searchPlaceholder="Search feedback..."
            getRowKey={(r) => r.id}
        />
    );
}
