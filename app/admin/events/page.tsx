import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, DbNotice, EmptyState, Panel } from "@/components/admin/ui";
import EventForm from "@/components/admin/event-form";
import ConfirmButton from "@/components/admin/confirm-button";
import { deleteEvent } from "@/app/admin/actions";
import { Trash2, MapPin, Users, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getEvents() {
    try {
        return await prisma.event.findMany({
            orderBy: { date: "desc" },
            include: { _count: { select: { members: true } } },
        });
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
                    <div className="grid gap-4 sm:grid-cols-2">
                        {events.map((e) => (
                            <Panel key={e.id} className="p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="font-display text-xl text-ivory">{e.title}</h3>
                                    <ConfirmButton
                                        action={deleteEvent.bind(null, e.id)}
                                        message={`Delete event "${e.title}"?`}
                                        className="text-ivory-soft transition-colors hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </ConfirmButton>
                                </div>
                                <div className="mt-3 space-y-1.5 text-sm text-ivory-soft">
                                    <div className="text-gold">
                                        {new Date(e.date).toLocaleString("en-GB", {
                                            weekday: "short", day: "numeric", month: "short", year: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </div>
                                    {e.venue && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" /> {e.venue}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" /> {e._count.members} assigned
                                    </div>
                                </div>
                                <Link
                                    href={`/admin/events/${e.id}`}
                                    className="mt-5 inline-flex items-center gap-1 text-sm font-medium uppercase tracking-[0.12em] text-gold hover:text-gold-soft"
                                >
                                    Manage <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Panel>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
