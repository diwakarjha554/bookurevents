import { prisma } from "@/lib/prisma";
import { PageHeader, DbNotice, EmptyState } from "@/components/admin/ui";
import NewsletterTable, { type SubscriberRow } from "@/components/admin/tables/newsletter-table";

export const dynamic = "force-dynamic";

async function getData(): Promise<SubscriberRow[] | null> {
    try {
        const rows = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
        return rows.map((r) => ({ id: r.id, email: r.email, createdAt: r.createdAt.toISOString() }));
    } catch {
        return null;
    }
}

export default async function NewsletterPage() {
    const rows = await getData();

    return (
        <div>
            <PageHeader
                title="Newsletter"
                subtitle={rows && rows.length ? `${rows.length} subscriber${rows.length === 1 ? "" : "s"}.` : "People who subscribed in the footer."}
            />
            {rows === null ? (
                <DbNotice />
            ) : rows.length === 0 ? (
                <EmptyState message="No subscribers yet." />
            ) : (
                <NewsletterTable rows={rows} />
            )}
        </div>
    );
}
