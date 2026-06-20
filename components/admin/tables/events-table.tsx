"use client";

import Link from "next/link";
import DataTable, { type Column } from "@/components/admin/data-table";
import ConfirmButton from "@/components/admin/confirm-button";
import { deleteEvent } from "@/app/admin/actions";
import { Trash2, MapPin, ArrowRight } from "lucide-react";

export type EventRow = {
    id: string;
    title: string;
    date: string;
    venue: string | null;
    assigned: number;
    upcoming: boolean;
};

const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function EventsTable({ rows }: { rows: EventRow[] }) {
    const columns: Column<EventRow>[] = [
        { key: "title", header: "Event", sortable: true, render: (r) => <span className="whitespace-nowrap font-medium text-ivory">{r.title}</span> },
        {
            key: "date", header: "Date & Time", sortable: true, value: (r) => r.date,
            render: (r) => <span className="whitespace-nowrap text-gold">{fmt(r.date)}</span>,
        },
        {
            key: "status", header: "Status", filterable: true,
            value: (r) => (r.upcoming ? "Upcoming" : "Past"),
            render: (r) => (
                <span className={`rounded-full px-2.5 py-0.5 text-xs ${r.upcoming ? "bg-[rgba(212,175,55,0.15)] text-gold" : "bg-white/5 text-ivory-soft"}`}>
                    {r.upcoming ? "Upcoming" : "Past"}
                </span>
            ),
        },
        {
            key: "venue", header: "Venue", value: (r) => r.venue ?? "",
            render: (r) => r.venue
                ? <span className="inline-flex items-center gap-1.5 text-ivory-soft"><MapPin className="h-3.5 w-3.5" /> {r.venue}</span>
                : <span className="text-ivory-soft">-</span>,
        },
        { key: "assigned", header: "Agents", sortable: true, align: "center", value: (r) => r.assigned, render: (r) => <span className="text-ivory">{r.assigned}</span> },
        {
            key: "actions", header: "", noExport: true, align: "right",
            render: (r) => (
                <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/events/${r.id}`} className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium uppercase tracking-[0.1em] text-gold hover:text-gold-soft">
                        Manage <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <ConfirmButton
                        action={deleteEvent.bind(null, r.id)}
                        message={`Delete event "${r.title}"?`}
                        className="text-ivory-soft transition-colors hover:text-red-400"
                    >
                        <Trash2 className="h-4 w-4" />
                    </ConfirmButton>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            rows={rows}
            columns={columns}
            exportName="events"
            exportTitle="Events"
            searchPlaceholder="Search events..."
            getRowKey={(r) => r.id}
        />
    );
}
