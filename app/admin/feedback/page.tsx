import { prisma } from "@/lib/prisma";
import { PageHeader, DbNotice, EmptyState } from "@/components/admin/ui";
import FeedbackTable, { type FeedbackRow } from "@/components/admin/tables/feedback-table";

export const dynamic = "force-dynamic";

async function getData(): Promise<FeedbackRow[] | null> {
    try {
        const rows = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
        return rows.map((r) => ({
            id: r.id, name: r.name, email: r.email, rating: r.rating, message: r.message,
            createdAt: r.createdAt.toISOString(),
        }));
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
                <FeedbackTable rows={rows} />
            )}
        </div>
    );
}
