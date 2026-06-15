import { prisma } from "@/lib/prisma";
import { getViewUrl } from "@/lib/b2";
import { PageHeader, DbNotice, EmptyState, Panel } from "@/components/admin/ui";
import ProofUpload from "@/components/admin/proof-upload";
import { setMemberPaid } from "@/app/admin/actions";
import { Check, RotateCcw, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

async function getRows() {
    try {
        const members = await prisma.eventMember.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: true, event: true },
        });
        return Promise.all(
            members.map(async (m) => ({
                ...m,
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
            <PageHeader
                title="Payments"
                subtitle="Agent pay per event, their QR codes, and payment proofs."
            />

            {rows === null ? (
                <DbNotice />
            ) : rows.length === 0 ? (
                <EmptyState message="No assignments yet. Assign agents to events first." />
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {rows.map((m) => (
                        <Panel key={m.id} className="p-6">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-display text-lg text-ivory">{m.user.name}</h3>
                                    <p className="text-sm text-ivory-soft">{m.event.title}</p>
                                    <p className="text-xs text-ivory-soft">
                                        {new Date(m.event.date).toLocaleDateString("en-GB", {
                                            day: "numeric", month: "short", year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="font-display text-2xl text-gold">₹ {m.pay.toLocaleString("en-IN")}</div>
                                    <span className={`text-xs ${m.paid ? "text-green-400" : "text-ivory-soft"}`}>
                                        {m.paid ? "Paid" : "Pending"}
                                    </span>
                                </div>
                            </div>

                            {m.user.upiId && (
                                <div className="mt-4 text-sm">
                                    <span className="text-xs uppercase tracking-[0.12em] text-gold">UPI </span>
                                    <span className="text-ivory">{m.user.upiId}</span>
                                </div>
                            )}

                            <div className="mt-4 flex flex-wrap items-start gap-6">
                                {/* QR */}
                                <div>
                                    <div className="mb-2 text-xs uppercase tracking-[0.12em] text-gold">Agent QR</div>
                                    {m.qrUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={m.qrUrl} alt="QR" className="h-28 w-28 rounded-sm border border-white/10 object-cover" />
                                    ) : (
                                        <div className="flex h-28 w-28 items-center justify-center rounded-sm border border-dashed border-white/10 text-xs text-ivory-soft">
                                            No QR
                                        </div>
                                    )}
                                </div>

                                {/* Proof */}
                                <div className="min-w-[160px] flex-1">
                                    <div className="mb-2 text-xs uppercase tracking-[0.12em] text-gold">Payment Proof</div>
                                    {m.proofUrl ? (
                                        <a
                                            href={m.proofUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mb-3 inline-flex items-center gap-1 text-sm text-gold hover:text-gold-soft"
                                        >
                                            <ExternalLink className="h-4 w-4" /> View proof
                                        </a>
                                    ) : (
                                        <p className="mb-3 text-xs text-ivory-soft">No proof uploaded.</p>
                                    )}
                                    <ProofUpload memberId={m.id} />
                                </div>
                            </div>

                            <div className="mt-5 border-t border-white/5 pt-4">
                                <form action={setMemberPaid.bind(null, m.id, !m.paid)}>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 text-sm text-ivory-soft transition-colors hover:text-gold"
                                    >
                                        {m.paid ? (
                                            <>
                                                <RotateCcw className="h-4 w-4" /> Mark as pending
                                            </>
                                        ) : (
                                            <>
                                                <Check className="h-4 w-4" /> Mark as paid
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </Panel>
                    ))}
                </div>
            )}
        </div>
    );
}
