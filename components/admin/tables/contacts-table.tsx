"use client";

import DataTable, { type Column } from "@/components/admin/data-table";
import { Mail, Phone } from "lucide-react";

export type ContactRow = {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
    phone: string | null;
    eventType: string | null;
    guestCount: string | null;
    eventDate: string | null;
    vision: string | null;
    createdAt: string;
};

const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const dash = (s: string | null) => (s && s.trim() ? s : "-");

export default function ContactsTable({ rows }: { rows: ContactRow[] }) {
    const columns: Column<ContactRow>[] = [
        {
            key: "name", header: "Name", sortable: true,
            value: (r) => `${r.firstName} ${r.lastName ?? ""}`.trim(),
            render: (r) => <span className="whitespace-nowrap font-medium text-ivory">{r.firstName} {r.lastName}</span>,
        },
        {
            key: "email", header: "Email", sortable: true,
            render: (r) => (
                <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 text-ivory-soft hover:text-gold">
                    <Mail className="h-3.5 w-3.5" /> {r.email}
                </a>
            ),
        },
        {
            key: "phone", header: "Phone", value: (r) => r.phone ?? "",
            render: (r) => r.phone
                ? <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 whitespace-nowrap text-ivory-soft hover:text-gold"><Phone className="h-3.5 w-3.5" /> {r.phone}</a>
                : <span className="text-ivory-soft">-</span>,
        },
        { key: "eventType", header: "Event Type", sortable: true, filterable: true, value: (r) => r.eventType ?? "", render: (r) => dash(r.eventType) },
        { key: "guestCount", header: "Guests", value: (r) => r.guestCount ?? "", render: (r) => dash(r.guestCount) },
        { key: "eventDate", header: "Event Date", value: (r) => r.eventDate ?? "", render: (r) => dash(r.eventDate) },
        {
            key: "vision", header: "Vision", value: (r) => r.vision ?? "",
            render: (r) => <span className="block max-w-[16rem] truncate text-ivory-soft" title={r.vision ?? ""}>{dash(r.vision)}</span>,
        },
        {
            key: "createdAt", header: "Submitted", sortable: true, value: (r) => r.createdAt,
            render: (r) => <span className="whitespace-nowrap text-ivory-soft">{fmt(r.createdAt)}</span>,
        },
    ];

    return (
        <DataTable
            rows={rows}
            columns={columns}
            exportName="contact-enquiries"
            exportTitle="Contact Enquiries"
            searchPlaceholder="Search enquiries..."
            getRowKey={(r) => r.id}
        />
    );
}
