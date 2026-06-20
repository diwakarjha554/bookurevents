import { prisma } from "@/lib/prisma";
import { getViewUrl } from "@/lib/b2";
import { PageHeader, DbNotice, EmptyState } from "@/components/admin/ui";
import AgentForm from "@/components/admin/agent-form";
import AgentsTable, { type AgentRow } from "@/components/admin/tables/agents-table";

export const dynamic = "force-dynamic";

async function getAgents(): Promise<AgentRow[] | null> {
    try {
        const agents = await prisma.user.findMany({
            where: { role: "AGENT" },
            orderBy: { createdAt: "desc" },
        });
        return Promise.all(
            agents.map(async (a) => ({
                id: a.id,
                name: a.name,
                email: a.email,
                phone: a.phone,
                upiId: a.upiId,
                qrUrl: await getViewUrl(a.qrCodeKey),
                hasQr: Boolean(a.qrCodeKey),
                createdAt: a.createdAt.toISOString(),
            }))
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
                    <AgentsTable rows={agents} />
                )}
            </div>
        </div>
    );
}
