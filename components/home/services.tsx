import Image from "next/image";
import { ArrowUpRight } from 'lucide-react';
import { DATA } from "@/lib/data";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const Services = () => {
  return (
    <section id="services" className="grain relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="glow left-[-8%] bottom-[10%] h-[460px] w-[460px] bg-[radial-gradient(circle,rgba(212,175,55,0.07),transparent_70%)]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-3xl text-center">
          <span className="eyebrow">What We Create</span>
          <h2 className="font-display mt-5 text-4xl font-light leading-tight text-ivory md:text-5xl lg:text-6xl">
            A full suite of
            <span className="text-gold-grad italic"> event craft</span>
          </h2>
          <p className="mt-5 text-ivory-soft">
            From the first idea to the final encore, every element is handled in house by people
            who care about the details as much as you do.
          </p>
        </Reveal>

        <Stagger gap={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DATA.services.map((service, index) => (
            <StaggerItem key={index}>
              <div className="group relative h-[26rem] overflow-hidden rounded-sm border border-[rgba(212,175,55,0.16)]">
                {/* Image */}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover opacity-50 grayscale transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 group-hover:grayscale-0"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/30" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-ivory-soft opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold group-hover:opacity-100" />

                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.4)] bg-ink/60 text-gold backdrop-blur transition-all duration-500 group-hover:scale-110">
                    <service.icon className="h-5 w-5" />
                  </div>

                  <h3 className="font-display text-xl text-ivory transition-colors group-hover:text-gold">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-ivory-soft">
                    {service.description}
                  </p>

                  {/* Features reveal */}
                  <ul className="mt-0 max-h-0 space-y-1.5 overflow-hidden opacity-0 transition-all duration-500 group-hover:mt-5 group-hover:max-h-40 group-hover:opacity-100">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-xs uppercase tracking-[0.1em] text-ivory-soft">
                        <span className="mr-2.5 h-1 w-1 rounded-full bg-gold" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export default Services;
