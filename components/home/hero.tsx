'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";
import { IMAGES } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};
const item = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export default function Hero() {
    return (
        <section
            id="home"
            className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-28 pb-20"
        >
            {/* Background image */}
            <motion.div
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.8, ease }}
                className="absolute inset-0"
            >
                <Image
                    src={IMAGES.hero}
                    alt="A luxury event by BookUrEvents"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
            </motion.div>

            {/* Cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/60" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7))]" />
            <div className="glow left-[-10%] top-[15%] h-[460px] w-[460px] bg-[radial-gradient(circle,rgba(212,175,55,0.16),transparent_70%)]" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mx-auto flex max-w-4xl flex-col items-center text-center"
                >
                    <motion.div variants={item} className="flex items-center gap-4">
                        <span className="h-px w-10 bg-[rgba(212,175,55,0.6)]" />
                        <span className="eyebrow">Luxury Event Atelier</span>
                        <span className="h-px w-10 bg-[rgba(212,175,55,0.6)]" />
                    </motion.div>

                    <motion.h1
                        variants={item}
                        className="font-display mt-7 text-[clamp(2rem,8vw,5.4rem)] font-light leading-[1.05] tracking-tight text-ivory"
                    >
                        We craft moments
                        <br />
                        that{" "}
                        <span className="text-gold-grad italic font-medium">stay with you</span>
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="mt-8 max-w-2xl text-base leading-relaxed text-ivory-soft sm:text-lg"
                    >
                        From boardroom galas to once in a lifetime weddings, BookUrEvents designs and
                        delivers extraordinary events across India. Impeccable planning, seamless
                        execution, and a finish that feels effortless to you.
                    </motion.p>

                    <motion.div
                        variants={item}
                        className="mt-11 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="btn-gold group w-full rounded-none px-8 py-6 text-sm font-semibold uppercase tracking-[0.14em] sm:w-auto"
                        >
                            <Link href="#contact">
                                Plan Your Event
                                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="group w-full rounded-none border border-[rgba(244,239,227,0.3)] bg-transparent px-8 py-6 text-sm uppercase tracking-[0.14em] text-ivory backdrop-blur-sm hover:bg-[rgba(244,239,227,0.08)] hover:text-gold sm:w-auto"
                        >
                            <Link href="#portfolio">
                                <Play className="mr-1 h-4 w-4" />
                                View Our Work
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        variants={item}
                        className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-ivory-soft"
                    >
                        {[
                            ["250+", "Events Delivered"],
                            ["30+", "Cities Served"],
                            ["99%", "Client Satisfaction"],
                        ].map(([num, label]) => (
                            <div key={label} className="flex items-center gap-2.5">
                                <span className="font-display text-2xl text-gold">{num}</span>
                                <span className="text-xs uppercase tracking-[0.16em]">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll cue */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 1 }}
                className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
            >
                <div className="flex h-10 w-6 items-start justify-center rounded-full border border-[rgba(212,175,55,0.4)] p-1.5">
                    <motion.span
                        animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="h-1.5 w-1.5 rounded-full bg-gold"
                    />
                </div>
            </motion.div>
        </section>
    )
}
