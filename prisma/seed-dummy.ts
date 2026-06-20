/**
 * Dummy data seeder for local testing.
 *   pnpm db:seed:dummy
 *
 * Wipes all non-admin data, then inserts 20 agents + ~250 distinct records
 * (events, contact enquiries, newsletter subs, feedback, and assignments)
 * spread across the last 12 months so the dashboard charts show real trends.
 *
 * ADMIN users are preserved. Run `pnpm db:seed` first if you have no admin yet.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ---- small random helpers --------------------------------------------------
const pick = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (p: number) => Math.random() < p;
/** A random Date within the last `monthsBack` months (optionally into the future). */
function randomDate(monthsBack: number, monthsForward = 0) {
    const now = Date.now();
    const start = now - monthsBack * 30 * 24 * 3600 * 1000;
    const end = now + monthsForward * 30 * 24 * 3600 * 1000;
    return new Date(start + Math.random() * (end - start));
}

const FIRST = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Ananya", "Diya", "Saanvi", "Aadya", "Kiara", "Myra", "Anika", "Navya", "Riya", "Aisha",
    "Rohan", "Kabir", "Dhruv", "Ved", "Yash", "Priya", "Neha", "Pooja", "Sneha", "Tara"];
const LAST = ["Sharma", "Verma", "Gupta", "Mehta", "Shah", "Patel", "Singh", "Reddy", "Nair", "Iyer",
    "Rao", "Kapoor", "Malhotra", "Chopra", "Joshi", "Desai", "Bose", "Khan", "Pillai", "Menon"];
const CITIES = ["Mumbai", "Delhi", "Udaipur", "Jaipur", "Goa", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Kolkata", "Lucknow", "Agra"];
const VENUES = ["The Leela Palace", "Taj Lake Palace", "ITC Grand", "JW Marriott", "Umaid Bhawan", "The Oberoi",
    "Radisson Blu", "Hyatt Regency", "Le Méridien", "Grand Hyatt", "Jaipur Exhibition Centre", "Phoenix Marketcity"];
const EVENT_TYPES = ["Luxury Wedding", "Corporate Gala", "Product Launch", "Birthday", "Anniversary",
    "Conference", "Reception", "Engagement", "Sangeet", "Award Night", "Brand Activation", "Private Celebration"];
const GUESTS = ["50-100", "100-200", "200-350", "350-500", "500+", "Under 50"];
const VISIONS = [
    "We want an elegant, intimate evening with warm lighting and a live acoustic set.",
    "A grand corporate gala that impresses our board and partners.",
    "Royal palace wedding with traditional decor and a modern twist.",
    "Minimalist product launch with a focus on stage and press experience.",
    "Beachside reception at sunset with a curated dinner menu.",
    "A vibrant sangeet night with choreography, DJ, and floral mandap.",
    "Sophisticated anniversary dinner for close family, black-tie.",
    "High-energy brand activation with influencers and live streaming.",
    "Garden party theme with pastel florals and a champagne bar.",
    "Destination wedding across three days with full coordination.",
    "Conference for 300 with breakout rooms and catered lunch.",
    "Surprise birthday with a casino theme and live band.",
];
const FEEDBACK_MSGS = [
    "Absolutely flawless execution. Every detail was perfect.",
    "The team understood exactly what we wanted. Highly recommend.",
    "Great experience overall, a few timing hiccups but well managed.",
    "Our guests are still talking about the decor and food.",
    "Professional, calm, and incredibly organised throughout.",
    "Beautiful event, though communication could be a touch faster.",
    "Exceeded our expectations on every front. Thank you!",
    "Seamless from first call to the last guest leaving.",
    "Stunning design and a wonderful team to work with.",
    "Good value and a memorable evening for everyone.",
    "They turned our vague idea into something magical.",
    "Reliable and creative - we'll book again next season.",
];

async function main() {
    console.log("Wiping non-admin data...");
    await prisma.eventMember.deleteMany();
    await prisma.event.deleteMany();
    await prisma.contactSubmission.deleteMany();
    await prisma.newsletterSubscriber.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.user.deleteMany({ where: { role: "AGENT" } });

    // ---- 20 agents ---------------------------------------------------------
    const passwordHash = await bcrypt.hash("Password123!", 10);
    const agentData = Array.from({ length: 20 }, (_, i) => {
        const first = FIRST[i % FIRST.length];
        const last = pick(LAST);
        return {
            name: `${first} ${last}`,
            email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@bookurevents-team.in`,
            phone: `+91 9${randInt(100000000, 999999999)}`,
            upiId: `${first.toLowerCase()}${randInt(100, 999)}@okaxis`,
            passwordHash,
            role: "AGENT" as const,
            createdAt: randomDate(12),
        };
    });
    await prisma.user.createMany({ data: agentData });
    const agents = await prisma.user.findMany({ where: { role: "AGENT" }, select: { id: true } });
    console.log(`✔ ${agents.length} agents`);

    // ---- events ------------------------------------------------------------
    const eventData = Array.from({ length: 26 }, (_, i) => ({
        title: `${pick(EVENT_TYPES)} - ${pick(LAST)} (${pick(CITIES)})`,
        date: randomDate(10, 4),
        venue: `${pick(VENUES)}, ${pick(CITIES)}`,
        description: pick(VISIONS),
        createdAt: randomDate(12),
    }));
    await prisma.event.createMany({ data: eventData });
    const events = await prisma.event.findMany({ select: { id: true } });
    console.log(`✔ ${events.length} events`);

    // ---- contact enquiries (spread across 12 months) -----------------------
    const contactData = Array.from({ length: 70 }, (_, i) => {
        const first = pick(FIRST);
        const last = pick(LAST);
        return {
            firstName: first,
            lastName: last,
            email: `${first.toLowerCase()}${i + 1}@example.com`,
            phone: chance(0.85) ? `+91 9${randInt(100000000, 999999999)}` : null,
            eventType: pick(EVENT_TYPES),
            guestCount: pick(GUESTS),
            eventDate: randomDate(0, 8).toISOString().slice(0, 10),
            vision: pick(VISIONS),
            createdAt: randomDate(12),
        };
    });
    await prisma.contactSubmission.createMany({ data: contactData });
    console.log(`✔ ${contactData.length} contact enquiries`);

    // ---- newsletter subscribers --------------------------------------------
    const subData = Array.from({ length: 55 }, (_, i) => {
        const first = pick(FIRST);
        return { email: `subscriber${i + 1}.${first.toLowerCase()}@example.com`, createdAt: randomDate(12) };
    });
    await prisma.newsletterSubscriber.createMany({ data: subData });
    console.log(`✔ ${subData.length} newsletter subscribers`);

    // ---- feedback (rating skewed toward 4-5) -------------------------------
    const feedbackData = Array.from({ length: 54 }, () => {
        const first = pick(FIRST);
        const last = pick(LAST);
        const rating = chance(0.7) ? randInt(4, 5) : randInt(1, 3);
        return {
            name: `${first} ${last}`,
            email: chance(0.8) ? `${first.toLowerCase()}.${last.toLowerCase()}@example.com` : null,
            rating: chance(0.9) ? rating : null,
            message: pick(FEEDBACK_MSGS),
            createdAt: randomDate(12),
        };
    });
    await prisma.feedback.createMany({ data: feedbackData });
    console.log(`✔ ${feedbackData.length} feedback entries`);

    // ---- assignments (event members + payments) ----------------------------
    let assignments = 0;
    for (const ev of events) {
        const shuffled = [...agents].sort(() => Math.random() - 0.5);
        const count = randInt(1, 4);
        for (const a of shuffled.slice(0, count)) {
            await prisma.eventMember.create({
                data: {
                    eventId: ev.id,
                    userId: a.id,
                    pay: Math.round(randInt(2000, 25000) / 500) * 500,
                    paid: chance(0.5),
                    createdAt: randomDate(12),
                },
            });
            assignments++;
        }
    }
    console.log(`✔ ${assignments} assignments`);

    const total = agents.length + events.length + contactData.length + subData.length + feedbackData.length + assignments;
    console.log(`\n✅ Done. ${total} dummy records created.`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
