"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DATA } from "@/lib/data";
import Image from "next/image";

interface NavItem {
    href: string;
    label: string;
}

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>('home');
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    // Extract the in-page section id from hrefs like "#about" or "/#about" ("" for plain routes)
    const sectionOf = (href: string): string => (href.includes('#') ? href.split('#')[1] : '');

    const isActive = (href: string): boolean => {
        const section = sectionOf(href);
        if (!section) {
            // plain route link (e.g. "/")
            if (href === '/' && pathname === '/') return !activeSection;
            return pathname === href;
        }
        return pathname === '/' && activeSection === section;
    };

    useEffect(() => {
        const handleScroll = (): void => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsScrolled(scrollTop > 40);

            if (pathname !== '/') return;

            const sections = DATA.navlinks
                .map(item => sectionOf(item.href))
                .filter(Boolean);

            let foundActiveSection = false;
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 120 && rect.bottom >= 120) {
                        setActiveSection(sections[i]);
                        foundActiveSection = true;
                        break;
                    }
                }
            }
            if (!foundActiveSection) setActiveSection('');
        };

        if (pathname === '/') {
            handleScroll();
        } else {
            setActiveSection('');
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    const handleNavClick = (href: string): void => {
        setActiveSection(sectionOf(href));
        setIsMenuOpen(false);
    };

    const handleMenuToggle = (): void => setIsMenuOpen(!isMenuOpen);

    return (
        <header
            id="header"
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                isScrolled || isMenuOpen
                    ? 'bg-ink border-b border-[rgba(212,175,55,0.25)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]'
                    : 'bg-transparent border-b border-transparent'
            }`}
        >
            {/* Announcement bar */}
            <div
                className={`overflow-hidden transition-all duration-500 ${
                    isScrolled ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'
                }`}
            >
                <div className="bg-[rgba(212,175,55,0.08)] border-b border-[rgba(212,175,55,0.14)]">
                    <p className="mx-auto max-w-3xl text-center text-[10px] leading-relaxed tracking-[0.16em] uppercase text-gold px-4 py-2.5 sm:text-xs sm:tracking-[0.22em]">
                        {DATA.uNav.message}
                    </p>
                </div>
            </div>

            <div className="container mx-auto">
                <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo_full_w.png"
                                alt="BookUrEvents"
                                width={1279}
                                height={240}
                                quality={100}
                                priority
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-9">
                        {DATA.navlinks.map((item: NavItem) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => handleNavClick(item.href)}
                                className={`group relative text-[13px] tracking-[0.14em] uppercase transition-colors duration-300 ${
                                    isActive(item.href) ? 'text-gold' : 'text-ivory-soft hover:text-ivory'
                                }`}
                            >
                                {item.label}
                                <span
                                    className={`pointer-events-none absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300 ${
                                        isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`}
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Button
                            asChild
                            className="btn-gold rounded-none cursor-pointer text-[13px] tracking-[0.12em] uppercase font-semibold px-6"
                        >
                            <Link href="/#contact" onClick={() => handleNavClick('/#contact')}>Plan Your Event</Link>
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden text-ivory"
                        onClick={handleMenuToggle}
                        type="button"
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden">
                        <div className="px-4 pt-2 pb-6 space-y-1 bg-ink border-t border-[rgba(212,175,55,0.25)]">
                            {DATA.navlinks.map((item: NavItem) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => handleNavClick(item.href)}
                                    className={`block px-3 py-3 text-sm tracking-[0.14em] uppercase border-b border-white/5 ${
                                        isActive(item.href) ? 'text-gold' : 'text-ivory-soft hover:text-ivory'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-3 px-3 pt-4">
                                <Button
                                    asChild
                                    className="btn-gold rounded-none cursor-pointer tracking-[0.12em] uppercase font-semibold"
                                >
                                    <Link href="/#contact" onClick={() => handleNavClick('/#contact')}>Plan Your Event</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
