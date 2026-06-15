import { DATA } from "@/lib/data";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import TeamCard from "@/components/home/team-card";

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
                            <TeamCard member={member} />
                        </StaggerItem>
                    ))}
                </Stagger>
            </div>
        </section>
    )
}
