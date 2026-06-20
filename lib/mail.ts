import nodemailer from "nodemailer";

export function isMailConfigured(): boolean {
    return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function transporter() {
    const port = Number(process.env.SMTP_PORT) || 587;
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
}

export async function sendMail(opts: { to: string; subject: string; html: string; replyTo?: string }) {
    if (!isMailConfigured()) {
        console.error("SMTP not configured - skipping email to", opts.to);
        return false;
    }
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;
    await transporter().sendMail({ from: `"BookUrEvents" <${from}>`, ...opts });
    return true;
}

export const esc = (s = "") =>
    s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
