import { prisma } from "@/lib/prisma";
import { PageHeader, DbNotice, EmptyState, Panel } from "@/components/admin/ui";
import { Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

async function getData() {
    try {
        return await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
    } catch {
        return null;
    }
}

export default async function ContactsPage() {
    const rows = await getData();

    return (
        <div>
            <PageHeader title="Contact Enquiries" subtitle="Submissions from the website contact form." />
            {rows === null ? (
                <DbNotice />
            ) : rows.length === 0 ? (
                <EmptyState message="No enquiries yet." />
            ) : (
                <div className="space-y-4">
                    {rows.map((r) => (
                        <Panel key={r.id} className="p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-display text-xl text-ivory">
                                        {r.firstName} {r.lastName}
                                    </h3>
                                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ivory-soft">
                                        <a href={`mailto:${r.email}`} className="flex items-center gap-2 hover:text-gold">
                                            <Mail className="h-4 w-4" /> {r.email}
                                        </a>
                                        {r.phone && (
                                            <a href={`tel:${r.phone}`} className="flex items-center gap-2 hover:text-gold">
                                                <Phone className="h-4 w-4" /> {r.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-ivory-soft">
                                    {new Date(r.createdAt).toLocaleString("en-GB")}
                                </span>
                            </div>

                            <div className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                                {r.eventType && <Field label="Event Type" value={r.eventType} />}
                                {r.guestCount && <Field label="Guests" value={r.guestCount} />}
                                {r.eventDate && <Field label="Event Date" value={r.eventDate} />}
                            </div>

                            {r.vision && (
                                <p className="mt-4 border-t border-white/5 pt-4 text-sm leading-relaxed text-ivory-soft">
                                    {r.vision}
                                </p>
                            )}
                        </Panel>
                    ))}
                </div>
            )}
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <span className="text-xs uppercase tracking-[0.14em] text-gold">{label}</span>
            <div className="text-ivory">{value}</div>
        </div>
    );
}
