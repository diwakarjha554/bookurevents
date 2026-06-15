import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Panel, EmptyState } from "@/components/admin/ui";
import AssignMemberForm from "@/components/admin/assign-member-form";
import ConfirmButton from "@/components/admin/confirm-button";
import { removeMember } from "@/app/admin/actions";
import { ArrowLeft, MapPin, Trash2, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let data;
    try {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                members: { include: { user: true }, orderBy: { createdAt: "asc" } },
            },
        });
        if (!event) notFound();
        const assignedIds = new Set(event.members.map((m) => m.userId));
        const allAgents = await prisma.user.findMany({
            where: { role: "AGENT" },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
        data = { event, available: allAgents.filter((a) => !assignedIds.has(a.id)) };
    } catch {
        notFound();
    }

    const { event, available } = data;

    return (
        <div>
            <Link
                href="/admin/events"
                className="mb-6 inline-flex items-center gap-2 text-sm text-ivory-soft transition-colors hover:text-gold"
            >
                <ArrowLeft className="h-4 w-4" /> All events
            </Link>

            <PageHeader
                title={event.title}
                subtitle={new Date(event.date).toLocaleString("en-GB", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                })}
            />

            {event.venue && (
                <p className="mb-6 flex items-center gap-2 text-sm text-ivory-soft">
                    <MapPin className="h-4 w-4 text-gold" /> {event.venue}
                </p>
            )}
            {event.description && (
                <p className="mb-8 max-w-2xl text-sm leading-relaxed text-ivory-soft">{event.description}</p>
            )}

            <Panel className="mb-8 p-6">
                <h3 className="mb-5 font-display text-lg text-ivory">Assign an agent</h3>
                <AssignMemberForm eventId={event.id} agents={available} />
            </Panel>

            <h3 className="mb-4 font-display text-lg text-ivory">
                Assigned agents ({event.members.length})
            </h3>

            {event.members.length === 0 ? (
                <EmptyState message="No agents assigned to this event yet." />
            ) : (
                <Panel className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-gold">
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4">Pay</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {event.members.map((m) => (
                                <tr key={m.id} className="border-b border-white/5 last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="text-ivory">{m.user.name}</div>
                                        <a href={`mailto:${m.user.email}`} className="flex items-center gap-1 text-xs text-ivory-soft hover:text-gold">
                                            <Mail className="h-3 w-3" /> {m.user.email}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-gold">₹ {m.pay.toLocaleString("en-IN")}</td>
                                    <td className="px-6 py-4">
                                        <span className={m.paid ? "text-green-400" : "text-ivory-soft"}>
                                            {m.paid ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ConfirmButton
                                            action={removeMember.bind(null, m.id, event.id)}
                                            message={`Remove ${m.user.name} from this event?`}
                                            className="text-ivory-soft transition-colors hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </ConfirmButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Panel>
            )}
        </div>
    );
}
