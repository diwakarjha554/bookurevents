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

        const to = process.env.CONTACT_TO || "info@bookurevents.in";
        const from = process.env.MAIL_FROM || process.env.SMTP_USER;

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
            from: `"BookUrEvents Website" <${from}>`,
            to,
            replyTo: email,
            subject: `New Event Enquiry — ${firstName} ${lastName ?? ""} (${eventType})`.trim(),
            html,
        });

        // Confirmation auto-reply to the person who submitted the form.
        // Wrapped separately so a failure here never fails the main enquiry.
        try {
            const confirmHtml = `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0a0a0b;color:#f4efe3;padding:40px 32px;border-radius:8px;border:1px solid rgba(212,175,55,0.25)">
                    <p style="letter-spacing:4px;text-transform:uppercase;color:#d4af37;font-size:12px;margin:0 0 12px">BookUrEvents</p>
                    <h2 style="color:#f4efe3;font-weight:400;margin:0 0 16px;font-size:26px">Thank you, ${esc(firstName)}.</h2>
                    <p style="color:#b9b2a6;line-height:1.7;margin:0 0 16px">
                        We have received your enquiry${eventType ? ` for your <span style="color:#d4af37">${esc(eventType)}</span>` : ""} and it is now with our team.
                    </p>
                    <p style="color:#b9b2a6;line-height:1.7;margin:0 0 24px">
                        One of our event specialists will personally reach out to you <strong style="color:#f4efe3">within 24 hours</strong> with ideas, a clear plan, and a complimentary consultation. We look forward to crafting something unforgettable with you.
                    </p>
                    <div style="height:1px;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:24px 0"></div>
                    <p style="color:#b9b2a6;line-height:1.7;margin:0 0 4px;font-size:14px">In the meantime, feel free to reach us directly:</p>
                    <p style="color:#f4efe3;margin:0 0 2px;font-size:14px">📞 +91 8700901115</p>
                    <p style="color:#f4efe3;margin:0 0 24px;font-size:14px">✉️ info@bookurevents.in</p>
                    <p style="color:#7a7468;font-size:12px;margin:0">With warm regards,<br/>The BookUrEvents Team</p>
                </div>`;

            await transporter.sendMail({
                from: `"BookUrEvents" <${from}>`,
                to: email,
                replyTo: "info@bookurevents.in",
                subject: "We have received your enquiry — BookUrEvents",
                html: confirmHtml,
            });
        } catch (confirmErr) {
            console.error("Confirmation email failed (enquiry still delivered):", confirmErr);
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Contact API error:", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
