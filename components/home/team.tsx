import Image from "next/image";
import { DATA } from "@/lib/data";
import { Mail } from "lucide-react";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

function initials(name: string) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function Team() {
    return (
        <section className="grain relative overflow-hidden bg-ink-soft py-24 md:py-32">
            <div className="glow right-[-5%] top-[10%] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)]" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="eyebrow">The People</span>
                    <h2 className="font-display mt-5 text-4xl font-light leading-tight text-ivory md:text-5xl lg:text-6xl">
                        The minds behind
                        <span className="text-gold-grad italic"> the magic</span>
                    </h2>
                    <p className="mt-5 text-ivory-soft">
                        A close knit team of specialists who treat your event as if it were their own,
                        because to us, it is.
                    </p>
                </Reveal>

                <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {DATA.team.map((member, index) => (
                        <StaggerItem key={index}>
                            <div className="card-luxe group h-full overflow-hidden rounded-sm">
                                <div className="relative h-72 overflow-hidden">
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            sizes="(max-width: 1024px) 50vw, 25vw"
                                            className="object-cover object-top grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                        />
                                    ) : (
                                        // Premium monogram placeholder (until real photo is added)
                                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.14),transparent_60%)] bg-ink">
                                            <span className="font-display text-6xl font-light text-gold-grad">
                                                {initials(member.name)}
                                            </span>
                                            <span className="pointer-events-none absolute inset-4 rounded-sm border border-[rgba(212,175,55,0.18)]" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

                                    <div className="absolute bottom-4 left-0 right-0 flex translate-y-4 justify-center gap-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                        <a href={member.social.linkedin} aria-label={`${member.name} on LinkedIn`} className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(212,175,55,0.4)] bg-ink/80 text-gold transition-colors hover:bg-gold hover:text-ink">
                                            <FaLinkedinIn className="h-3.5 w-3.5" />
                                        </a>
                                        <a href={member.social.twitter} aria-label={`${member.name} on X`} className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(212,175,55,0.4)] bg-ink/80 text-gold transition-colors hover:bg-gold hover:text-ink">
                                            <FaXTwitter className="h-3.5 w-3.5" />
                                        </a>
                                        <a href={`mailto:${member.social.email}`} aria-label={`Email ${member.name}`} className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(212,175,55,0.4)] bg-ink/80 text-gold transition-colors hover:bg-gold hover:text-ink">
                                            <Mail className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </div>

                                <div className="p-6 text-center">
                                    <h3 className="font-display text-xl text-ivory transition-colors group-hover:text-gold">
                                        {member.name}
                                    </h3>
                                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gold">{member.role}</p>
                                </div>
                            </div>
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    )
}
