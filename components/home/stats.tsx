import { DATA } from "@/lib/data";

const Stats = () => {
  // duplicate the list so the marquee loops seamlessly
  const items = [...DATA.marquee, ...DATA.marquee];

  return (
    <section className="marquee relative overflow-hidden border-y border-[rgba(212,175,55,0.14)] bg-ink-soft py-5">
      <div className="flex w-max marquee-track">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="px-8 font-display text-lg italic text-ivory-soft transition-colors hover:text-gold sm:text-xl">
              {item}
            </span>
            <span className="text-gold">&#10022;</span>
          </div>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-soft to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-soft to-transparent" />
    </section>
  );
};

export default Stats;
