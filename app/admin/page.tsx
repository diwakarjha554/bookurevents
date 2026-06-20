import { prisma } from "@/lib/prisma";
import { PageHeader, StatCard, DbNotice } from "@/components/admin/ui";
import { ChartCard, AreaChart, BarChart, DonutChart } from "@/components/admin/charts";
import { Inbox, Mail, MessageSquare, Users, CalendarDays, Wallet, IndianRupee, CalendarClock } from "lucide-react";

export const dynamic = "force-dynamic";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Build the last `n` month buckets (oldest → newest). */
function monthBuckets(n: number) {
    const now = new Date();
    const out: { key: string; label: string; value: number }[] = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        out.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTHS[d.getMonth()], value: 0 });
    }
    return out;
}

function bucketByMonth(dates: Date[], n: number) {
    const buckets = monthBuckets(n);
    const index = new Map(buckets.map((b, i) => [b.key, i]));
    for (const date of dates) {
        const d = new Date(date);
        const k = `${d.getFullYear()}-${d.getMonth()}`;
        const i = index.get(k);
        if (i !== undefined) buckets[i].value++;
    }
    return buckets;
}

async function getData() {
    try {
        const now = new Date();
        const [
            contacts, subscribers, feedbackCount, agents, events, members,
            contactDates, subDates, feedbackRows, memberRows, upcoming,
        ] = await Promise.all([
            prisma.contactSubmission.count(),
            prisma.newsletterSubscriber.count(),
            prisma.feedback.count(),
            prisma.user.count({ where: { role: "AGENT" } }),
            prisma.event.count(),
            prisma.eventMember.count(),
            prisma.contactSubmission.findMany({ select: { createdAt: true } }),
            prisma.newsletterSubscriber.findMany({ select: { createdAt: true } }),
            prisma.feedback.findMany({ select: { rating: true } }),
            prisma.eventMember.findMany({ select: { pay: true, paid: true } }),
            prisma.event.count({ where: { date: { gte: now } } }),
        ]);

        const enquiriesByMonth = bucketByMonth(contactDates.map((c) => c.createdAt), 12);
        const subsByMonth = bucketByMonth(subDates.map((s) => s.createdAt), 12);

        const ratings = [1, 2, 3, 4, 5].map((star) => ({
            label: `${star}★`,
            value: feedbackRows.filter((f) => f.rating === star).length,
        }));

        const collected = memberRows.filter((m) => m.paid).reduce((s, m) => s + m.pay, 0);
        const pending = memberRows.filter((m) => !m.paid).reduce((s, m) => s + m.pay, 0);

        return {
            counts: { contacts, subscribers, feedbackCount, agents, events, members, upcoming },
            enquiriesByMonth, subsByMonth, ratings,
            payments: { collected, pending },
        };
    } catch {
        return null;
    }
}

const inr = (n: number) => "₹ " + n.toLocaleString("en-IN");

export default async function AdminDashboard() {
    const data = await getData();

    return (
        <div>
            <PageHeader title="Dashboard" subtitle="An overview of everything happening at BookUrEvents." />

            {!data ? (
                <DbNotice />
            ) : (
                <div className="space-y-6">
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <StatCard label="Contact Enquiries" value={data.counts.contacts} href="/admin/contacts" icon={<Inbox className="h-5 w-5" />} />
                        <StatCard label="Newsletter Subs" value={data.counts.subscribers} href="/admin/newsletter" icon={<Mail className="h-5 w-5" />} />
                        <StatCard label="Feedback" value={data.counts.feedbackCount} href="/admin/feedback" icon={<MessageSquare className="h-5 w-5" />} />
                        <StatCard label="Agents" value={data.counts.agents} href="/admin/agents" icon={<Users className="h-5 w-5" />} />
                        <StatCard label="Events" value={data.counts.events} href="/admin/events" icon={<CalendarDays className="h-5 w-5" />} hint={`${data.counts.upcoming} upcoming`} />
                        <StatCard label="Assignments" value={data.counts.members} href="/admin/payments" icon={<Wallet className="h-5 w-5" />} />
                        <StatCard label="Collected" value={inr(data.payments.collected)} href="/admin/payments" icon={<IndianRupee className="h-5 w-5" />} />
                        <StatCard label="Pending Payout" value={inr(data.payments.pending)} href="/admin/payments" icon={<CalendarClock className="h-5 w-5" />} />
                    </div>

                    {/* Charts row 1 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                        <ChartCard title="Enquiries" subtitle="Contact submissions over the last 12 months" className="lg:col-span-2">
                            <AreaChart data={data.enquiriesByMonth} />
                        </ChartCard>
                        <ChartCard title="Feedback Ratings" subtitle="Distribution of star ratings">
                            <DonutChart data={data.ratings} />
                        </ChartCard>
                    </div>

                    {/* Charts row 2 */}
                    <div className="grid gap-4 lg:grid-cols-3">
                        <ChartCard title="Newsletter Signups" subtitle="New subscribers per month (12 months)" className="lg:col-span-2">
                            <BarChart data={data.subsByMonth} />
                        </ChartCard>
                        <ChartCard title="Payments" subtitle="Agent payout status by amount">
                            <DonutChart
                                data={[
                                    { label: "Collected", value: data.payments.collected, color: "#4ade80" },
                                    { label: "Pending", value: data.payments.pending, color: "#d4af37" },
                                ]}
                            />
                        </ChartCard>
                    </div>
                </div>
            )}
        </div>
    );
}
