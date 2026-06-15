import { prisma } from "@/lib/prisma";
import { getViewUrl } from "@/lib/b2";
import { PageHeader, DbNotice, EmptyState, Panel } from "@/components/admin/ui";
import AgentForm from "@/components/admin/agent-form";
import ConfirmButton from "@/components/admin/confirm-button";
import { deleteAgent } from "@/app/admin/actions";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getAgents() {
    try {
        const agents = await prisma.user.findMany({
            where: { role: "AGENT" },
            orderBy: { createdAt: "desc" },
        });
        return Promise.all(
            agents.map(async (a) => ({ ...a, qrUrl: await getViewUrl(a.qrCodeKey) }))
        );
    } catch {
        return null;
    }
}

export default async function AgentsPage() {
    const agents = await getAgents();

    return (
        <div>
            <PageHeader title="Agents" subtitle="Team members who can be assigned to events." />

            <div className="space-y-8">
                <AgentForm />

                {agents === null ? (
                    <DbNotice />
                ) : agents.length === 0 ? (
                    <EmptyState message="No agents yet. Create one above." />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {agents.map((a) => (
                            <Panel key={a.id} className="p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate font-display text-lg text-ivory">{a.name}</h3>
                                        <p className="truncate text-sm text-ivory-soft">{a.email}</p>
                                    </div>
                                    <ConfirmButton
                                        action={deleteAgent.bind(null, a.id)}
                                        message={`Delete agent ${a.name}? This also removes their event assignments.`}
                                        className="text-ivory-soft transition-colors hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </ConfirmButton>
                                </div>

                                <div className="mt-4 space-y-1 text-sm">
                                    {a.phone && (
                                        <div>
                                            <span className="text-xs uppercase tracking-[0.12em] text-gold">Phone </span>
                                            <span className="text-ivory">{a.phone}</span>
                                        </div>
                                    )}
                                    {a.upiId && (
                                        <div>
                                            <span className="text-xs uppercase tracking-[0.12em] text-gold">UPI </span>
                                            <span className="text-ivory">{a.upiId}</span>
                                        </div>
                                    )}
                                </div>

                                {a.qrUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={a.qrUrl}
                                        alt={`${a.name} QR`}
                                        className="mt-4 h-32 w-32 rounded-sm border border-white/10 object-cover"
                                    />
                                ) : a.qrCodeKey ? (
                                    <p className="mt-4 text-xs text-ivory-soft">QR stored (configure B2 to preview).</p>
                                ) : (
                                    <p className="mt-4 text-xs text-ivory-soft">No QR uploaded.</p>
                                )}
                            </Panel>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
