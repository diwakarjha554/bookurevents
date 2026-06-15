"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/motion/reveal";
import { Star, Send, Loader2 } from "lucide-react";

const fieldClass =
    "rounded-none border-0 border-b border-[rgba(244,239,227,0.18)] bg-transparent px-0 text-ivory shadow-none placeholder:text-ivory-soft/60 focus-visible:border-gold focus-visible:ring-0 h-12";
const labelClass = "block text-xs uppercase tracking-[0.16em] text-ivory-soft";

export default function FeedbackPage() {
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const payload = { ...Object.fromEntries(fd.entries()), rating: rating ? String(rating) : "" };

        setLoading(true);
        const pending = toast.loading("Sending your feedback...");
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Failed to send");
            toast.success("Thank you for your feedback.", { id: pending });
            form.reset();
            setRating(0);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong.", { id: pending });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Navbar isNavbarMargin={false}>
            <main className="grain relative overflow-hidden bg-ink pt-36 pb-24 md:pt-44 md:pb-32">
                <div className="glow left-[-6%] top-[12%] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(212,175,55,0.10),transparent_70%)]" />

                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                    <Reveal className="mx-auto max-w-2xl text-center">
                        <span className="eyebrow">We Are Listening</span>
                        <h1 className="font-display mt-5 text-4xl font-light leading-tight text-ivory md:text-6xl">
                            Share your
                            <span className="text-gold-grad italic"> feedback</span>
                        </h1>
                        <p className="mt-5 text-ivory-soft">
                            Your experience matters to us. Tell us what you loved, or how we can make the next
                            occasion even more memorable.
                        </p>
                    </Reveal>

                    <Reveal delay={0.1} className="mx-auto mt-14 max-w-2xl">
                        <form onSubmit={handleSubmit} className="card-luxe rounded-sm p-6 sm:p-10">
                            <div className="space-y-8">
                                <div className="grid gap-7 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className={labelClass}>Your Name *</label>
                                        <Input name="name" required placeholder="John Doe" className={fieldClass} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelClass}>Email (optional)</label>
                                        <Input name="email" type="email" placeholder="john@example.com" className={fieldClass} />
                                    </div>
                                </div>

                                {/* Star rating */}
                                <div className="space-y-3">
                                    <label className={labelClass}>How was your experience?</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                aria-label={`${star} star`}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`h-8 w-8 transition-colors ${
                                                        star <= (hover || rating)
                                                            ? "fill-gold text-gold"
                                                            : "text-ivory-soft/40"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={labelClass}>Your Feedback *</label>
                                    <Textarea
                                        name="message"
                                        required
                                        rows={6}
                                        placeholder="Tell us about your experience with BookUrEvents..."
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
                                            Submit Feedback
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Reveal>
                </div>
            </main>
            <Footer />
        </Navbar>
    );
}
