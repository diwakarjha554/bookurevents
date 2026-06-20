"use client";

import DataTable, { type Column } from "@/components/admin/data-table";
import ConfirmButton from "@/components/admin/confirm-button";
import { removeMember } from "@/app/admin/actions";
import { Trash2, Mail } from "lucide-react";

export type MemberRow = {
    id: string;
    eventId: string;
    name: string;
    email: string;
    pay: number;
    paid: boolean;
};

export default function EventMembersTable({ rows }: { rows: MemberRow[] }) {
    const columns: Column<MemberRow>[] = [
        {
            key: "name", header: "Agent", sortable: true,
            value: (r) => r.name,
            render: (r) => (
                <div>
                    <div className="font-medium text-ivory">{r.name}</div>
                    <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 text-xs text-ivory-soft hover:text-gold">
                        <Mail className="h-3 w-3" /> {r.email}
                    </a>
                </div>
            ),
        },
        {
            key: "pay", header: "Pay", sortable: true, align: "right", value: (r) => r.pay,
            render: (r) => <span className="whitespace-nowrap text-gold">₹ {r.pay.toLocaleString("en-IN")}</span>,
        },
        {
            key: "status", header: "Status", filterable: true, value: (r) => (r.paid ? "Paid" : "Pending"),
            render: (r) => <span className={r.paid ? "text-green-400" : "text-ivory-soft"}>{r.paid ? "Paid" : "Pending"}</span>,
        },
        {
            key: "actions", header: "", noExport: true, align: "right",
            render: (r) => (
                <ConfirmButton
                    action={removeMember.bind(null, r.id, r.eventId)}
                    message={`Remove ${r.name} from this event?`}
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
            exportName="event-agents"
            exportTitle="Assigned Agents"
            searchPlaceholder="Search agents..."
            getRowKey={(r) => r.id}
            initialPageSize={25}
        />
    );
}
