"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";
import { uploadFile } from "@/lib/b2";
import { sendMail, esc } from "@/lib/mail";
import { signOut } from "@/auth";

type Result = { ok?: boolean; error?: string };

export async function logoutAction(): Promise<void> {
    await signOut({ redirectTo: "/login" });
}

const str = (fd: FormData, k: string) => String(fd.get(k) || "").trim();

/* ----------------------------- Agents ----------------------------- */

export async function createAgent(_prev: Result, fd: FormData): Promise<Result> {
    await requireAdmin();
    const name = str(fd, "name");
    const email = str(fd, "email").toLowerCase();
    const phone = str(fd, "phone");
    const upiId = str(fd, "upiId");
    const password = str(fd, "password");

    if (!name || !email || !password) return { error: "Name, email and password are required." };

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return { error: "A user with this email already exists." };

    let qrCodeKey: string | null = null;
    const qr = fd.get("qrCode");
    if (qr instanceof File && qr.size > 0) {
        try {
            qrCodeKey = await uploadFile(qr, "qr-codes");
        } catch (e) {
            console.error("QR upload failed:", e);
            return { error: "Could not upload the QR image. Check Backblaze B2 settings." };
        }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: { name, email, phone: phone || null, upiId: upiId || null, qrCodeKey, passwordHash, role: "AGENT" },
    });

    revalidatePath("/admin/agents");
    revalidatePath("/admin/payments");
    return { ok: true };
}

export async function deleteAgent(id: string): Promise<void> {
    await requireAdmin();
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/agents");
    revalidatePath("/admin/payments");
}

/* ----------------------------- Events ----------------------------- */

export async function createEvent(_prev: Result, fd: FormData): Promise<Result> {
    await requireAdmin();
    const title = str(fd, "title");
    const date = str(fd, "date");
    const venue = str(fd, "venue");
    const description = str(fd, "description");

    if (!title || !date) return { error: "Title and date are required." };

    await prisma.event.create({
        data: { title, date: new Date(date), venue: venue || null, description: description || null },
    });
    revalidatePath("/admin/events");
    return { ok: true };
}

export async function deleteEvent(id: string): Promise<void> {
    await requireAdmin();
    await prisma.event.delete({ where: { id } });
    revalidatePath("/admin/events");
}

/* ------------------------- Event members -------------------------- */

export async function assignMember(_prev: Result, fd: FormData): Promise<Result> {
    await requireAdmin();
    const eventId = str(fd, "eventId");
    const userId = str(fd, "userId");
    const pay = Number(str(fd, "pay") || "0");

    if (!eventId || !userId) return { error: "Please choose an agent." };

    const existing = await prisma.eventMember.findUnique({
        where: { eventId_userId: { eventId, userId } },
    });
    if (existing) return { error: "This agent is already assigned to the event." };

    await prisma.eventMember.create({ data: { eventId, userId, pay: isNaN(pay) ? 0 : pay } });

    // Email the agent their event details
    const [event, user] = await Promise.all([
        prisma.event.findUnique({ where: { id: eventId } }),
        prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (event && user) {
        const dateStr = new Date(event.date).toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        });
        try {
            await sendMail({
                to: user.email,
                subject: `You're assigned to an event - ${event.title}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0a0a0b;color:#f4efe3;padding:36px 32px;border-radius:8px;border:1px solid rgba(212,175,55,0.25)">
                        <p style="letter-spacing:4px;text-transform:uppercase;color:#d4af37;font-size:12px;margin:0 0 12px">BookUrEvents</p>
                        <h2 style="color:#f4efe3;font-weight:400;margin:0 0 16px;font-size:24px">Hello ${esc(user.name)},</h2>
                        <p style="color:#b9b2a6;line-height:1.7;margin:0 0 20px">You have been assigned to the following event. Please find the details below.</p>
                        <table style="width:100%;border-collapse:collapse">
                            <tr><td style="padding:10px 12px;border-bottom:1px solid #1b191d;color:#d4af37;font-weight:bold;width:120px">Event</td><td style="padding:10px 12px;border-bottom:1px solid #1b191d">${esc(event.title)}</td></tr>
                            <tr><td style="padding:10px 12px;border-bottom:1px solid #1b191d;color:#d4af37;font-weight:bold">Date</td><td style="padding:10px 12px;border-bottom:1px solid #1b191d">${dateStr}</td></tr>
                            ${event.venue ? `<tr><td style="padding:10px 12px;border-bottom:1px solid #1b191d;color:#d4af37;font-weight:bold">Venue</td><td style="padding:10px 12px;border-bottom:1px solid #1b191d">${esc(event.venue)}</td></tr>` : ""}
                            ${event.description ? `<tr><td style="padding:10px 12px;border-bottom:1px solid #1b191d;color:#d4af37;font-weight:bold;vertical-align:top">Details</td><td style="padding:10px 12px;border-bottom:1px solid #1b191d">${esc(event.description)}</td></tr>` : ""}
                            <tr><td style="padding:10px 12px;color:#d4af37;font-weight:bold">Your Pay</td><td style="padding:10px 12px;color:#d4af37;font-weight:bold">₹ ${pay.toLocaleString("en-IN")}</td></tr>
                        </table>
                        <p style="color:#7a7468;font-size:12px;margin:24px 0 0">BookUrEvents Team</p>
                    </div>`,
                replyTo: process.env.CONTACT_TO?.split(",")[0]?.trim() || undefined,
            });
        } catch (e) {
            console.error("Assignment email failed (member still added):", e);
        }
    }

    revalidatePath(`/admin/events/${eventId}`);
    revalidatePath("/admin/events");
    revalidatePath("/admin/payments");
    return { ok: true };
}

export async function removeMember(memberId: string, eventId: string): Promise<void> {
    await requireAdmin();
    await prisma.eventMember.delete({ where: { id: memberId } });
    revalidatePath(`/admin/events/${eventId}`);
    revalidatePath("/admin/payments");
}

export async function setMemberPaid(memberId: string, paid: boolean): Promise<void> {
    await requireAdmin();
    await prisma.eventMember.update({ where: { id: memberId }, data: { paid } });
    revalidatePath("/admin/payments");
}

export async function uploadPaymentProof(_prev: Result, fd: FormData): Promise<Result> {
    await requireAdmin();
    const memberId = str(fd, "memberId");
    const proof = fd.get("proof");
    if (!memberId || !(proof instanceof File) || proof.size === 0) {
        return { error: "Please choose a file." };
    }
    let key: string;
    try {
        key = await uploadFile(proof, "payment-proofs");
    } catch (e) {
        console.error("Proof upload failed:", e);
        return { error: "Upload failed. Check Backblaze B2 settings." };
    }
    await prisma.eventMember.update({ where: { id: memberId }, data: { paymentProofKey: key, paid: true } });
    revalidatePath("/admin/payments");
    return { ok: true };
}
