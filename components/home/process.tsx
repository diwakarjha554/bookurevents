import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const steps = [
    {
        number: "01",
        title: "Discovery & Vision",
        description:
            "We begin with a conversation, understanding your vision, your guests, and the feeling you want in the room.",
        details: ["Consultation", "Vision alignment", "Budget framing"],
    },
    {
        number: "02",
        title: "Design & Strategy",
        description:
            "We translate that vision into a complete concept, theme, layout, and a plan with nothing left to chance.",
        details: ["Concept & theme", "Vendor curation", "Timeline build"],
    },
    {
        number: "03",
        title: "Production & Detailing",
        description:
            "Decor, lighting, catering, and entertainment come together with reviews and rehearsals before the day.",
        details: ["Decor & set", "Walkthroughs", "Final approvals"],
    },
    {
        number: "04",
        title: "Flawless Event Day",
        description:
            "Our team runs everything on ground, managing every moment so you stay fully present in yours.",
        details: ["On ground crew", "Live management", "Guest experience"],
    },
];

export default function Process() {
    return (
        <section id="process" className="grain relative overflow-hidden bg-ink-soft py-24 md:py-32">
            <div className="glow right-1/4 top-0 h-[420px] w-[600px] bg-[radial-gradient(ellipse,rgba(212,175,55,0.07),transparent_70%)]" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="eyebrow">The Process</span>
                    <h2 className="font-display mt-5 text-4xl font-light leading-tight text-ivory md:text-5xl lg:text-6xl">
                        Effortless for you,
                        <span className="text-gold-grad italic"> meticulous for us</span>
                    </h2>
                    <p className="mt-5 text-ivory-soft">
                        A refined four step method that takes your event from first idea to a flawless
                        day, with you in control at every stage.
                    </p>
                </Reveal>

                <Stagger gap={0.12} className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.35)] to-transparent lg:block" />

                    {steps.map((step) => (
                        <StaggerItem key={step.number}>
                            <div className="group relative h-full">
                                <div className="mb-7 flex items-center gap-4">
                                    <span className="font-display text-5xl font-light text-gold-grad">
                                        {step.number}
                                    </span>
                                    <span className="h-px flex-1 bg-[rgba(212,175,55,0.2)] transition-all duration-500 group-hover:bg-[rgba(212,175,55,0.6)]" />
                                </div>
                                <h3 className="font-display text-xl text-ivory">{step.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-ivory-soft">
                                    {step.description}
                                </p>
                                <ul className="mt-5 space-y-2">
                                    {step.details.map((detail) => (
                                        <li key={detail} className="flex items-center text-xs uppercase tracking-[0.12em] text-ivory-soft">
                                            <span className="mr-2.5 h-1 w-1 rounded-full bg-gold" />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </StaggerItem>
                    ))}
                </Stagger>

                <Reveal className="mt-16 text-center" delay={0.1}>
                    <Button
                        asChild
                        size="lg"
                        className="btn-gold group rounded-none px-8 py-6 text-sm font-semibold uppercase tracking-[0.14em]"
                    >
                        <Link href="#contact">
                            Start Planning Today
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </Reveal>
            </div>
        </section>
    )
}
