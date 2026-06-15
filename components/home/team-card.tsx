"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

interface Member {
    name: string;
    role: string;
    image: string;
    social: { linkedin: string; twitter: string; email: string };
}

function initials(name: string) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function TeamCard({ member }: { member: Member }) {
    // `active` mirrors the desktop hover state, but is toggled by tap on touch devices.
    const [active, setActive] = useState(false);

    return (
        <div
            onClick={() => setActive((v) => !v)}
            className="card-luxe group h-full cursor-pointer select-none overflow-hidden rounded-sm"
        >
            <div className="relative h-72 overflow-hidden">
                {member.image ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className={`object-cover object-top transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 ${
                            active ? "scale-105 grayscale-0" : "grayscale"
                        }`}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.14),transparent_60%)] bg-ink">
                        <span className="font-display text-6xl font-light text-gold-grad">{initials(member.name)}</span>
                        <span className="pointer-events-none absolute inset-4 rounded-sm border border-[rgba(212,175,55,0.18)]" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

                <div
                    className={`absolute bottom-4 left-0 right-0 flex justify-center gap-3 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 ${
                        active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                >
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
                <h3 className={`font-display text-xl transition-colors group-hover:text-gold ${active ? "text-gold" : "text-ivory"}`}>
                    {member.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gold">{member.role}</p>
            </div>
        </div>
    );
}
