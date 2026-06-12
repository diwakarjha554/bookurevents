import { DATA } from "@/lib/data";
import { CountUp } from "@/components/motion/count-up";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export default function Trust() {
    return (
        <section className="grain relative overflow-hidden bg-ink py-24 md:py-32">
            <div className="glow left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(212,175,55,0.08),transparent_70%)]" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="eyebrow">By The Numbers</span>
                    <h2 className="font-display mt-5 text-4xl font-light leading-tight text-ivory md:text-5xl">
                        Trusted to deliver the
                        <span className="text-gold-grad italic"> moments that matter</span>
                    </h2>
                    <p className="mt-5 text-ivory-soft">
                        Years of meticulous planning have built a reputation our clients return to,
                        and recommend. The numbers tell part of the story.
                    </p>
                </Reveal>

                <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[rgba(212,175,55,0.14)] bg-[rgba(212,175,55,0.14)] lg:grid-cols-4">
                    {DATA.homeTrust.map((stat, index) => (
                        <StaggerItem key={index}>
                            <div className="group h-full bg-ink px-4 py-8 text-center transition-colors duration-500 hover:bg-ink-soft sm:p-8 md:p-10">
                                <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.3)] text-gold transition-transform duration-500 group-hover:scale-110">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className="font-display text-4xl font-light text-ivory sm:text-5xl md:text-6xl">
                                    <CountUp to={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="mt-3 break-words text-[11px] font-medium uppercase tracking-[0.08em] text-gold sm:text-sm sm:tracking-[0.16em]">
                                    {stat.label}
                                </div>
                                <div className="mt-2 text-xs text-ivory-soft">{stat.note}</div>
                            </div>
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    )
}
