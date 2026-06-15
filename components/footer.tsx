import Link from "next/link";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import Image from "next/image";
import NewsletterForm from "@/components/newsletter-form";

const Footer = () => {
    return (
        <footer className="grain relative overflow-hidden border-t border-[rgba(212,175,55,0.16)] bg-ink-soft text-ivory">
            <div className="glow left-1/2 top-[-10%] h-[300px] w-[700px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(212,175,55,0.08),transparent_70%)]" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                {/* Newsletter / CTA band */}
                <div className="relative overflow-hidden rounded-sm border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.05)] p-8 md:p-12">
                    <div className="grid items-center gap-8 md:grid-cols-2">
                        <div>
                            <span className="eyebrow">Stay In The Know</span>
                            <h3 className="font-display mt-3 text-3xl font-light text-ivory md:text-4xl">
                                Inspiration for your
                                <span className="text-gold-grad italic"> next event</span>
                            </h3>
                            <p className="mt-3 text-ivory-soft">
                                Planning notes, trends, and seasonal offers, sent occasionally. No spam, ever.
                            </p>
                        </div>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company */}
                    <div className="space-y-6">
                        <Link href="/" className="flex w-fit items-center">
                            <Image
                                src="/logo_full_w.png"
                                alt="BookUrEvents"
                                width={1000000}
                                height={1000000}
                                quality={100}
                                className="h-[30.4px] w-36 object-contain"
                            />
                        </Link>
                        <p className="leading-relaxed text-ivory-soft">
                            A luxury event atelier crafting extraordinary experiences through inspired
                            design, impeccable execution, and an obsession with the details.
                        </p>
                        <div className="flex gap-3">
                            {[FaInstagram, FaFacebookF, FaXTwitter, FaLinkedinIn].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(212,175,55,0.3)] text-gold transition-colors hover:bg-gold hover:text-ink"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Explore</h3>
                        <ul className="space-y-3">
                            {[["About", "/#about"], ["Services", "/#services"], ["Process", "/#process"], ["Contact", "/#contact"]].map(([item, href]) => (
                                <li key={item}>
                                    <Link href={href} className="group flex items-center text-ivory-soft transition-colors hover:text-gold">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Company</h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Terms & Condition", href: "/terms" },
                                { label: "Feedback", href: "/feedback" },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="group flex items-center text-ivory-soft transition-colors hover:text-gold">
                                        <ArrowRight className="mr-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Get In Touch</h3>
                        <div className="space-y-4">
                            <a href="tel:+918700901115" className="flex items-center gap-3 text-ivory-soft transition-colors hover:text-gold">
                                <Phone className="h-5 w-5 flex-shrink-0 text-gold" />
                                <span className="text-sm">+91 8700901115</span>
                            </a>
                            <a href="mailto:info@bookurevents.in" className="flex items-center gap-3 text-ivory-soft transition-colors hover:text-gold">
                                <Mail className="h-5 w-5 flex-shrink-0 text-gold" />
                                <span className="text-sm">info@bookurevents.in</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-6">
                    <div className="flex flex-col items-center justify-between gap-4 text-sm text-ivory-soft md:flex-row">
                        <span>
                            Copyright &copy; {new Date().getFullYear()}{' '}
                            <Link href="/" className="font-semibold text-gold transition-colors hover:text-gold-soft">
                                BookUrEvents
                            </Link>
                            . All Rights Reserved.
                        </span>
                        <span>
                            Designed with <span className="select-none text-lg text-gold">&hearts;</span> by{' '}
                            <Link
                                href="https://diwakarjha.vercel.app/"
                                target="_blank"
                                className="font-semibold text-gold transition-colors hover:text-gold-soft"
                            >
                                Diwakar Jha
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
