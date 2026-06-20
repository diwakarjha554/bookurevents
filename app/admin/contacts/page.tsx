import { prisma } from "@/lib/prisma";
import { PageHeader, DbNotice, EmptyState } from "@/components/admin/ui";
import ContactsTable, { type ContactRow } from "@/components/admin/tables/contacts-table";

export const dynamic = "force-dynamic";

async function getData(): Promise<ContactRow[] | null> {
    try {
        const rows = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
        return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
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
                <ContactsTable rows={rows} />
            )}
        </div>
    );
}
