import { prisma } from "@/lib/prisma";
import { getViewUrl } from "@/lib/b2";
import { PageHeader, DbNotice, EmptyState } from "@/components/admin/ui";
import PaymentsTable, { type PaymentRow } from "@/components/admin/tables/payments-table";

export const dynamic = "force-dynamic";

async function getRows(): Promise<PaymentRow[] | null> {
    try {
        const members = await prisma.eventMember.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: true, event: true },
        });
        return Promise.all(
            members.map(async (m) => ({
                id: m.id,
                agentName: m.user.name,
                agentUpi: m.user.upiId,
                eventTitle: m.event.title,
                eventDate: m.event.date.toISOString(),
                pay: m.pay,
                paid: m.paid,
                qrUrl: await getViewUrl(m.user.qrCodeKey),
                proofUrl: await getViewUrl(m.paymentProofKey),
            }))
        );
    } catch {
        return null;
    }
}

export default async function PaymentsPage() {
    const rows = await getRows();

    return (
        <div>
            <PageHeader title="Payments" subtitle="Agent pay per event, their QR codes, and payment proofs." />

            {rows === null ? (
                <DbNotice />
            ) : rows.length === 0 ? (
                <EmptyState message="No assignments yet. Assign agents to events first." />
            ) : (
                <PaymentsTable rows={rows} />
            )}
        </div>
    );
}
