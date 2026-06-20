import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, Panel, EmptyState } from "@/components/admin/ui";
import AssignMemberForm from "@/components/admin/assign-member-form";
import EventMembersTable from "@/components/admin/tables/event-members-table";
import { ArrowLeft, MapPin } from "lucide-react";

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
                <EventMembersTable
                    rows={event.members.map((m) => ({
                        id: m.id,
                        eventId: event.id,
                        name: m.user.name,
                        email: m.user.email,
                        pay: m.pay,
                        paid: m.paid,
                    }))}
                />
            )}
        </div>
    );
}
