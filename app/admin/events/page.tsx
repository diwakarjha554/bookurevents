import { prisma } from "@/lib/prisma";
import { PageHeader, DbNotice, EmptyState } from "@/components/admin/ui";
import EventForm from "@/components/admin/event-form";
import EventsTable, { type EventRow } from "@/components/admin/tables/events-table";

export const dynamic = "force-dynamic";

async function getEvents(): Promise<EventRow[] | null> {
    try {
        const now = new Date();
        const events = await prisma.event.findMany({
            orderBy: { date: "desc" },
            include: { _count: { select: { members: true } } },
        });
        return events.map((e) => ({
            id: e.id,
            title: e.title,
            date: e.date.toISOString(),
            venue: e.venue,
            assigned: e._count.members,
            upcoming: e.date >= now,
        }));
    } catch {
        return null;
    }
}

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div>
            <PageHeader title="Events" subtitle="Create events and assign agents with their pay." />

            <div className="space-y-8">
                <EventForm />

                {events === null ? (
                    <DbNotice />
                ) : events.length === 0 ? (
                    <EmptyState message="No events yet. Create one above." />
                ) : (
                    <EventsTable rows={events} />
                )}
            </div>
        </div>
    );
}
