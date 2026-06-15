import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const { email } = (await req.json()) as { email?: string };
        const clean = email?.toLowerCase().trim();

        if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
            return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
        }

        try {
            await prisma.newsletterSubscriber.upsert({
                where: { email: clean },
                update: {},
                create: { email: clean },
            });
        } catch (dbErr) {
            console.error("Newsletter DB error:", dbErr);
            return NextResponse.json(
                { error: "Subscription service is not available right now. Please try again later." },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Newsletter API error:", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
