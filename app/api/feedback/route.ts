import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface FeedbackPayload {
    name?: string;
    email?: string;
    rating?: string;
    message?: string;
}

const esc = (s = "") =>
    s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));

export async function POST(req: Request) {
    try {
        const { name, email, rating, message } = (await req.json()) as FeedbackPayload;

        if (!name?.trim() || !message?.trim()) {
            return NextResponse.json(
                { error: "Please share your name and a few words of feedback." },
                { status: 400 }
            );
        }

        // Persist to DB (best-effort)
        try {
            await prisma.feedback.create({
                data: { name, email: email || null, rating: rating ? Number(rating) : null, message },
            });
        } catch (dbErr) {
            console.error("Feedback DB persist failed (continuing):", dbErr);
        }

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("SMTP credentials are not configured in .env");
            return NextResponse.json(
                { error: "Feedback service is not configured yet. Please try again later." },
                { status: 500 }
            );
        }

        const port = Number(process.env.SMTP_PORT) || 587;
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
            port,
            secure: port === 465,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const to = process.env.CONTACT_TO || "info@bookurevents.in";
        const from = process.env.MAIL_FROM || process.env.SMTP_USER;
        const stars = rating ? "★".repeat(Number(rating)) + "☆".repeat(5 - Number(rating)) : "Not rated";

        const html = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0a0a0b;color:#f4efe3;padding:32px;border-radius:8px">
                <h2 style="color:#d4af37;margin:0 0 4px">New Feedback</h2>
                <p style="color:#b9b2a6;margin:0 0 24px">via bookurevents.in</p>
                <table style="width:100%;border-collapse:collapse">
                    <tr><td style="padding:10px 12px;border-bottom:1px solid #1b191d;color:#d4af37;font-weight:bold;width:120px">Name</td><td style="padding:10px 12px;border-bottom:1px solid #1b191d">${esc(name)}</td></tr>
                    ${email ? `<tr><td style="padding:10px 12px;border-bottom:1px solid #1b191d;color:#d4af37;font-weight:bold">Email</td><td style="padding:10px 12px;border-bottom:1px solid #1b191d">${esc(email)}</td></tr>` : ""}
                    <tr><td style="padding:10px 12px;border-bottom:1px solid #1b191d;color:#d4af37;font-weight:bold">Rating</td><td style="padding:10px 12px;border-bottom:1px solid #1b191d;color:#d4af37">${stars}</td></tr>
                    <tr><td style="padding:10px 12px;border-bottom:1px solid #1b191d;color:#d4af37;font-weight:bold;vertical-align:top">Feedback</td><td style="padding:10px 12px;border-bottom:1px solid #1b191d">${esc(message)}</td></tr>
                </table>
            </div>`;

        await transporter.sendMail({
            from: `"BookUrEvents Feedback" <${from}>`,
            to,
            replyTo: email || undefined,
            subject: `New Feedback — ${name}${rating ? ` (${rating}/5)` : ""}`,
            html,
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Feedback API error:", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
