import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

interface ContactPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    eventType?: string;
    guestCount?: string;
    eventDate?: string;
    vision?: string;
}

const esc = (s = "") =>
    s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));

export async function POST(req: Request) {
    try {
        const data = (await req.json()) as ContactPayload;
        const { firstName, lastName, email, phone, eventType, guestCount, eventDate, vision } = data;

        if (!firstName?.trim() || !email?.trim() || !eventType?.trim() || !vision?.trim()) {
            return NextResponse.json(
                { error: "Please fill in your name, email, event type and vision." },
                { status: 400 }
            );
        }

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("SMTP credentials are not configured in .env");
            return NextResponse.json(
                { error: "Email service is not configured yet. Please try again later." },
                { status: 500 }
            );
        }

        const port = Number(process.env.SMTP_PORT) || 465;
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port,
            secure: port === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const to = process.env.CONTACT_TO || "diwakarjha554@gmail.com";

        const rows: [string, string | undefined][] = [
            ["Name", `${firstName} ${lastName ?? ""}`.trim()],
            ["Email", email],
            ["Phone", phone],
            ["Event Type", eventType],
            ["Guest Count", guestCount],
            ["Event Date", eventDate],
            ["Vision", vision],
        ];

        const html = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0a0a0b;color:#f4efe3;padding:32px;border-radius:8px">
                <h2 style="color:#d4af37;margin:0 0 4px">New Event Enquiry</h2>
                <p style="color:#b9b2a6;margin:0 0 24px">via bookurevents.in</p>
                <table style="width:100%;border-collapse:collapse">
                    ${rows
                        .filter(([, v]) => v && v.trim())
                        .map(
                            ([k, v]) =>
                                `<tr>
                                    <td style="padding:10px 12px;border-bottom:1px solid #1b191d;color:#d4af37;font-weight:bold;vertical-align:top;width:140px">${k}</td>
                                    <td style="padding:10px 12px;border-bottom:1px solid #1b191d">${esc(v)}</td>
                                </tr>`
                        )
                        .join("")}
                </table>
            </div>`;

        await transporter.sendMail({
            from: `"BookUrEvents Website" <${process.env.SMTP_USER}>`,
            to,
            replyTo: email,
            subject: `New Event Enquiry — ${firstName} ${lastName ?? ""} (${eventType})`.trim(),
            html,
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Contact API error:", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
