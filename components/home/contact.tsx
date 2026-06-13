"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const fieldClass =
    "rounded-none border-0 border-b border-[rgba(244,239,227,0.18)] bg-transparent px-0 text-ivory shadow-none placeholder:text-ivory-soft/60 focus-visible:border-gold focus-visible:ring-0 h-12";

const labelClass = "block text-xs uppercase tracking-[0.16em] text-ivory-soft";

const contactInfo = [
    { icon: Phone, label: "Call Us", value: "+91 8700901115", sub: "Mon to Sat, 10am to 7pm" },
    { icon: Mail, label: "Email Us", value: "info@bookurevents.in", sub: "We reply within 24 hours" },
    { icon: MapPin, label: "Service Area", value: "PAN India & Destination", sub: "Wherever your event takes us" },
    { icon: Clock, label: "Plan Ahead", value: "Now booking 2026", sub: "Secure your preferred date" },
];

export default function Contact() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());

        setLoading(true);
        const pending = toast.loading("Sending your enquiry...");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Failed to send");
            toast.success("Thank you. We will be in touch within 24 hours.", { id: pending });
            form.reset();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong.", { id: pending });
        } finally {
            setLoading(false);
        }
    }

    return (
        <section id="contact" className="grain relative overflow-hidden bg-ink py-24 md:py-32">
            <div className="glow left-[-5%] top-[15%] h-[460px] w-[460px] bg-[radial-gradient(circle,rgba(212,175,55,0.10),transparent_70%)]" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                    {/* Left - pitch + info */}
                    <Reveal direction="right">
                        <span className="eyebrow">Let&rsquo;s Begin</span>
                        <h2 className="font-display mt-5 text-4xl font-light leading-[1.1] text-ivory md:text-5xl lg:text-6xl">
                            Your unforgettable
                            <span className="text-gold-grad italic"> event starts here</span>
                        </h2>
                        <p className="mt-6 max-w-md text-base leading-relaxed text-ivory-soft sm:text-lg">
                            Tell us what you are dreaming of. We will get back within 24 hours with ideas,
                            a clear plan, and a complimentary consultation. No pressure, just possibility.
                        </p>

                        <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                            {contactInfo.map((info) => (
                                <div key={info.label} className="flex items-start gap-4">
                                    <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-[rgba(212,175,55,0.3)] text-gold">
                                        <info.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.16em] text-ivory-soft">{info.label}</div>
                                        <div className="mt-1 font-medium text-ivory">{info.value}</div>
                                        <div className="text-xs text-ivory-soft">{info.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    {/* Right - form */}
                    <Reveal direction="left" delay={0.1}>
                        <form onSubmit={handleSubmit} className="card-luxe rounded-sm p-6 sm:p-10">
                            <div className="space-y-7">
                                <div className="grid gap-7 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className={labelClass}>First Name *</label>
                                        <Input name="firstName" required placeholder="John" className={fieldClass} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClass}>Last Name</label>
                                        <Input name="lastName" placeholder="Doe" className={fieldClass} />
                                    </div>
                                </div>

                                <div className="grid gap-7 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className={labelClass}>Email Address *</label>
                                        <Input name="email" type="email" required placeholder="john@example.com" className={fieldClass} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClass}>Phone Number</label>
                                        <Input name="phone" type="tel" placeholder="+91 00000 00000" className={fieldClass} />
                                    </div>
                                </div>

                                <div className="grid gap-7 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className={labelClass}>Event Type *</label>
                                        <Input name="eventType" required placeholder="Wedding, Corporate, Private" className={fieldClass} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClass}>Guest Count</label>
                                        <Input name="guestCount" placeholder="100 to 200 guests" className={fieldClass} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={labelClass}>Event Date (if known)</label>
                                    <DatePicker name="eventDate" placeholder="Select your event date" />
                                </div>

                                <div className="space-y-2">
                                    <label className={labelClass}>Tell us about your vision *</label>
                                    <Textarea
                                        name="vision"
                                        required
                                        placeholder="Share your dream event, the mood you want, guest count, budget range, and any details that help us picture it..."
                                        rows={5}
                                        className="resize-none rounded-none border-0 border-b border-[rgba(244,239,227,0.18)] bg-transparent px-0 text-ivory shadow-none placeholder:text-ivory-soft/60 focus-visible:border-gold focus-visible:ring-0"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={loading}
                                    className="btn-gold group w-full rounded-none py-6 text-sm font-semibold uppercase tracking-[0.14em] disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-1 h-4 w-4" />
                                            Send My Enquiry
                                        </>
                                    )}
                                </Button>
                                <p className="text-center text-xs text-ivory-soft">
                                    We respect your privacy. Your details are never shared.
                                </p>
                            </div>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
