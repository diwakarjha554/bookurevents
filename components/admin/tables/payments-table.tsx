"use client";

import DataTable, { type Column } from "@/components/admin/data-table";
import ProofUpload from "@/components/admin/proof-upload";
import { setMemberPaid } from "@/app/admin/actions";
import { Check, RotateCcw, ExternalLink, QrCode } from "lucide-react";

export type PaymentRow = {
    id: string;
    agentName: string;
    agentUpi: string | null;
    eventTitle: string;
    eventDate: string;
    pay: number;
    paid: boolean;
    qrUrl: string | null;
    proofUrl: string | null;
};

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function PaymentsTable({ rows }: { rows: PaymentRow[] }) {
    const columns: Column<PaymentRow>[] = [
        { key: "agentName", header: "Agent", sortable: true, render: (r) => <span className="whitespace-nowrap font-medium text-ivory">{r.agentName}</span> },
        { key: "eventTitle", header: "Event", sortable: true, filterable: true, render: (r) => <span className="whitespace-nowrap text-ivory-soft">{r.eventTitle}</span> },
        { key: "eventDate", header: "Date", sortable: true, value: (r) => r.eventDate, render: (r) => <span className="whitespace-nowrap text-ivory-soft">{fmtDate(r.eventDate)}</span> },
        {
            key: "pay", header: "Pay", sortable: true, align: "right", value: (r) => r.pay,
            render: (r) => <span className="whitespace-nowrap font-medium text-gold">₹ {r.pay.toLocaleString("en-IN")}</span>,
        },
        {
            key: "status", header: "Status", filterable: true, value: (r) => (r.paid ? "Paid" : "Pending"),
            render: (r) => (
                <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs ${r.paid ? "bg-green-500/15 text-green-400" : "bg-white/5 text-ivory-soft"}`}>
                    {r.paid ? "Paid" : "Pending"}
                </span>
            ),
        },
        { key: "agentUpi", header: "UPI", value: (r) => r.agentUpi ?? "", render: (r) => r.agentUpi ?? "-" },
        {
            key: "proof", header: "Proof", noExport: true,
            render: (r) =>
                r.proofUrl ? (
                    <a href={r.proofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-gold hover:text-gold-soft">
                        <ExternalLink className="h-3.5 w-3.5" /> View
                    </a>
                ) : (
                    <ProofUpload memberId={r.id} />
                ),
        },
        {
            key: "qr", header: "QR", noExport: true,
            render: (r) =>
                r.qrUrl ? (
                    <a href={r.qrUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-ivory-soft hover:text-gold">
                        <QrCode className="h-3.5 w-3.5" /> View
                    </a>
                ) : (
                    <span className="text-xs text-ivory-soft">-</span>
                ),
        },
        {
            key: "actions", header: "", noExport: true, align: "right",
            render: (r) => (
                <form action={setMemberPaid.bind(null, r.id, !r.paid)}>
                    <button type="submit" className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-ivory-soft transition-colors hover:text-gold">
                        {r.paid ? <><RotateCcw className="h-3.5 w-3.5" /> Pending</> : <><Check className="h-3.5 w-3.5" /> Mark paid</>}
                    </button>
                </form>
            ),
        },
    ];

    return (
        <DataTable
            rows={rows}
            columns={columns}
            exportName="payments"
            exportTitle="Payments"
            searchPlaceholder="Search payments..."
            getRowKey={(r) => r.id}
        />
    );
}
