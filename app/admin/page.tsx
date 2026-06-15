import { prisma } from "@/lib/prisma";
import { PageHeader, StatCard, DbNotice } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

async function getCounts() {
    try {
        const [contacts, subscribers, feedback, agents, events, members] = await Promise.all([
            prisma.contactSubmission.count(),
            prisma.newsletterSubscriber.count(),
            prisma.feedback.count(),
            prisma.user.count({ where: { role: "AGENT" } }),
            prisma.event.count(),
            prisma.eventMember.count(),
        ]);
        return { contacts, subscribers, feedback, agents, events, members };
    } catch {
        return null;
    }
}

export default async function AdminDashboard() {
    const counts = await getCounts();

    return (
        <div>
            <PageHeader title="Dashboard" subtitle="An overview of everything happening at BookUrEvents." />
            {!counts ? (
                <DbNotice />
            ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <StatCard label="Contact Enquiries" value={counts.contacts} href="/admin/contacts" />
                    <StatCard label="Newsletter Subs" value={counts.subscribers} href="/admin/newsletter" />
                    <StatCard label="Feedback" value={counts.feedback} href="/admin/feedback" />
                    <StatCard label="Agents" value={counts.agents} href="/admin/agents" />
                    <StatCard label="Events" value={counts.events} href="/admin/events" />
                    <StatCard label="Assignments" value={counts.members} href="/admin/payments" />
                </div>
            )}
        </div>
    );
}
