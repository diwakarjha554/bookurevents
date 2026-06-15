import { prisma } from "@/lib/prisma";
import { PageHeader, DbNotice, EmptyState, Panel } from "@/components/admin/ui";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

async function getData() {
    try {
        return await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
    } catch {
        return null;
    }
}

export default async function FeedbackPage() {
    const rows = await getData();

    return (
        <div>
            <PageHeader title="Feedback" subtitle="Feedback submitted through the /feedback page." />
            {rows === null ? (
                <DbNotice />
            ) : rows.length === 0 ? (
                <EmptyState message="No feedback yet." />
            ) : (
                <div className="space-y-4">
                    {rows.map((r) => (
                        <Panel key={r.id} className="p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-display text-lg text-ivory">{r.name}</h3>
                                    {r.email && <div className="text-sm text-ivory-soft">{r.email}</div>}
                                </div>
                                <div className="flex items-center gap-3">
                                    {r.rating ? (
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < r.rating! ? "fill-gold text-gold" : "text-ivory-soft/30"}`}
                                                />
                                            ))}
                                        </div>
                                    ) : null}
                                    <span className="text-xs text-ivory-soft">
                                        {new Date(r.createdAt).toLocaleDateString("en-GB")}
                                    </span>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-ivory-soft">{r.message}</p>
                        </Panel>
                    ))}
                </div>
            )}
        </div>
    );
}
