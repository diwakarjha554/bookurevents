import { Quote, Star } from "lucide-react";
import { DATA } from "@/lib/data";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

function initials(name: string) {
    const parts = name.replace(/&/g, "").trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function Testimonials() {
    return (
        <section className="grain relative overflow-hidden bg-ink py-24 md:py-32">
            <div className="glow left-1/4 bottom-0 h-[400px] w-[600px] bg-[radial-gradient(ellipse,rgba(212,175,55,0.07),transparent_70%)]" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="eyebrow">In Their Words</span>
                    <h2 className="font-display mt-5 text-4xl font-light leading-tight text-ivory md:text-5xl lg:text-6xl">
                        Loved by the people
                        <span className="text-gold-grad italic"> we plan for</span>
                    </h2>
                </Reveal>

                <Stagger className="grid gap-6 lg:grid-cols-3">
                    {DATA.testimonials.map((t, index) => (
                        <StaggerItem key={index}>
                            <figure className="card-luxe flex h-full flex-col rounded-sm p-8">
                                <Quote className="h-8 w-8 text-gold" />
                                <blockquote className="mt-5 flex-1 font-display text-lg font-light italic leading-relaxed text-ivory">
                                    &ldquo;{t.quote}&rdquo;
                                </blockquote>
                                <div className="mt-6 flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                                    ))}
                                </div>
                                <figcaption className="mt-5 flex items-center gap-4 border-t border-white/5 pt-5">
                                    <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full border border-[rgba(212,175,55,0.35)] bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.18),transparent_60%)] font-display text-base text-gold">
                                        {initials(t.name)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-ivory">{t.name}</div>
                                        <div className="text-sm text-gold">{t.role}</div>
                                    </div>
                                </figcaption>
                            </figure>
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    )
}
