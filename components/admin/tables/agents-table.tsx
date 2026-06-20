"use client";

import DataTable, { type Column } from "@/components/admin/data-table";
import ConfirmButton from "@/components/admin/confirm-button";
import { deleteAgent } from "@/app/admin/actions";
import { Trash2, Mail } from "lucide-react";

export type AgentRow = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    upiId: string | null;
    qrUrl: string | null;
    hasQr: boolean;
    createdAt: string;
};

const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function AgentsTable({ rows }: { rows: AgentRow[] }) {
    const columns: Column<AgentRow>[] = [
        { key: "name", header: "Name", sortable: true, render: (r) => <span className="whitespace-nowrap font-medium text-ivory">{r.name}</span> },
        {
            key: "email", header: "Email", sortable: true,
            render: (r) => <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 text-ivory-soft hover:text-gold"><Mail className="h-3.5 w-3.5" /> {r.email}</a>,
        },
        { key: "phone", header: "Phone", value: (r) => r.phone ?? "", render: (r) => r.phone ?? "-" },
        { key: "upiId", header: "UPI", value: (r) => r.upiId ?? "", render: (r) => r.upiId ?? "-" },
        {
            key: "qr", header: "QR", value: (r) => (r.hasQr ? "Yes" : "No"), filterable: true,
            render: (r) =>
                r.qrUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.qrUrl} alt={`${r.name} QR`} className="h-12 w-12 rounded-sm border border-white/10 object-cover" />
                ) : r.hasQr ? (
                    <span className="text-xs text-ivory-soft">Stored</span>
                ) : (
                    <span className="text-xs text-ivory-soft">-</span>
                ),
        },
        {
            key: "createdAt", header: "Joined", sortable: true, value: (r) => r.createdAt,
            render: (r) => <span className="whitespace-nowrap text-ivory-soft">{fmt(r.createdAt)}</span>,
        },
        {
            key: "actions", header: "", noExport: true, align: "right",
            render: (r) => (
                <ConfirmButton
                    action={deleteAgent.bind(null, r.id)}
                    message={`Delete agent ${r.name}? This also removes their event assignments.`}
                    className="text-ivory-soft transition-colors hover:text-red-400"
                >
                    <Trash2 className="h-4 w-4" />
                </ConfirmButton>
            ),
        },
    ];

    return (
        <DataTable
            rows={rows}
            columns={columns}
            exportName="agents"
            exportTitle="Agents"
            searchPlaceholder="Search agents..."
            getRowKey={(r) => r.id}
        />
    );
}
