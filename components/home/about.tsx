import Image from "next/image";
import { Target, HeartHandshake, ShieldCheck, Lightbulb } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { IMAGES } from "@/lib/data";

const highlights = [
  {
    icon: Target,
    title: "Tailored to You",
    description: "We design around your goals, your guests, and your vision, never a template.",
  },
  {
    icon: HeartHandshake,
    title: "One Point of Contact",
    description: "A dedicated planner stays with you from the first call to the final toast.",
  },
  {
    icon: ShieldCheck,
    title: "Flawless Execution",
    description: "A trusted vendor network keeps your event precise, calm, and on time.",
  },
  {
    icon: Lightbulb,
    title: "Creative at the Core",
    description: "Concepts, themes, and production ideas that make your event unforgettable.",
  },
];

const About = () => {
  return (
    <section id="about" className="grain relative overflow-hidden bg-ink-soft py-24 md:py-32">
      <div className="glow right-[-5%] top-[20%] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(212,175,55,0.08),transparent_70%)]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image collage */}
          <Reveal direction="right" className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-[rgba(212,175,55,0.18)]">
              <Image
                src={IMAGES.aboutMain}
                alt="A wedding moment crafted by BookUrEvents"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>

            {/* Accent image */}
            <div className="absolute -bottom-8 -right-4 hidden h-44 w-56 overflow-hidden rounded-sm border border-[rgba(212,175,55,0.3)] shadow-2xl sm:block lg:-right-8">
              <Image
                src={IMAGES.aboutAccent}
                alt="A gala dinner setting"
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>

            {/* Gold experience badge */}
            <div className="absolute -left-2 -top-4 flex h-16 w-16 flex-col items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)] bg-ink/90 backdrop-blur sm:h-[4.5rem] sm:w-[4.5rem] lg:-left-5">
              <span className="font-display text-xl text-gold sm:text-2xl">5+</span>
              <span className="text-[8px] uppercase tracking-[0.14em] text-ivory-soft sm:text-[9px]">Years</span>
            </div>
          </Reveal>

          {/* Text */}
          <Reveal direction="left" delay={0.1}>
            <span className="eyebrow">The Atelier</span>
            <h2 className="font-display mt-5 text-4xl font-light leading-[1.1] text-ivory md:text-5xl">
              Where vision becomes an
              <span className="text-gold-grad italic"> experience</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ivory-soft">
              At BookUrEvents, we are the quiet force behind events people remember. From corporate
              conferences and product launches to luxury weddings and private celebrations, our team
              blends meticulous planning with on ground precision, so the day feels seamless and
              entirely yours. Your only job is to enjoy it.
            </p>
            <div className="mt-7 gold-line w-32" />

            <Stagger className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {highlights.map((hl, index) => (
                <StaggerItem key={index}>
                  <div className="group flex gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(212,175,55,0.3)] text-gold transition-transform duration-500 group-hover:scale-110">
                      <hl.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-ivory">{hl.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ivory-soft">{hl.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default About;
