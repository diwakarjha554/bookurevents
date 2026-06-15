import { prisma } from "@/lib/prisma";
import { PageHeader, DbNotice, EmptyState, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

async function getData() {
    try {
        return await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
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
                <Panel className="overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-gold">
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Subscribed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id} className="border-b border-white/5 last:border-0">
                                    <td className="px-6 py-4 text-ivory">{r.email}</td>
                                    <td className="px-6 py-4 text-ivory-soft">
                                        {new Date(r.createdAt).toLocaleDateString("en-GB")}
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
