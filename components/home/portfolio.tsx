import Image from "next/image";
import { DATA } from "@/lib/data";
import { Reveal } from "@/components/motion/reveal";

export default function Portfolio() {
    return (
        <section id="portfolio" className="grain relative overflow-hidden bg-ink py-24 md:py-32">
            <div className="glow left-1/4 bottom-0 h-[400px] w-[600px] bg-[radial-gradient(ellipse,rgba(212,175,55,0.07),transparent_70%)]" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="eyebrow">Selected Work</span>
                    <h2 className="font-display mt-5 text-4xl font-light leading-tight text-ivory md:text-5xl lg:text-6xl">
                        Moments we were
                        <span className="text-gold-grad italic"> proud to create</span>
                    </h2>
                    <p className="mt-5 text-ivory-soft">
                        A glimpse into the celebrations, galas, and gatherings we have brought to life.
                        Every frame is a promise of what yours could be.
                    </p>
                </Reveal>

                <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[260px] lg:grid-cols-4">
                    {DATA.gallery.map((item, index) => (
                        <Reveal
                            key={index}
                            delay={(index % 4) * 0.08}
                            className={`group relative overflow-hidden rounded-sm border border-[rgba(212,175,55,0.16)] ${item.span}`}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="(max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-all duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

                            <div className="absolute inset-0 flex flex-col justify-end p-5">
                                <span className="translate-y-2 text-[10px] uppercase tracking-[0.2em] text-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                    {item.category}
                                </span>
                                <h3 className="font-display text-lg text-ivory md:text-xl">{item.title}</h3>
                            </div>

                            {/* gold corner */}
                            <div className="absolute left-4 top-4 h-6 w-6 border-l border-t border-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
