// Generators for /llms.txt and /llms-full.txt (https://llmstxt.org).
//
// This is a single-page marketing site for BookUrEvents (a luxury event atelier).
// There is no CMS / blog - the public content lives in @/lib/data (services,
// portfolio gallery, team, testimonials) plus curated section copy below, so we
// reuse DATA directly instead of fetching. Both builders are async to keep the
// route handlers uniform and future-proof (e.g. if a public blog is added later).

import { DATA } from "@/lib/data";
import { siteConfig, absoluteUrl } from "@/lib/site";

const BRAND = siteConfig.siteName;

/** Strip a trailing " - Brand" / " | Brand" suffix from a meta title for a cleaner label. */
function cleanTitle(title: string): string {
    return title.replace(new RegExp(`\\s*[|\\-–-]\\s*${BRAND}\\s*$`, "i"), "").trim();
}

const SUMMARY =
    'BookUrEvents is a premium event management company (a "luxury event atelier") based in India. ' +
    "We design and deliver unforgettable corporate events, luxury weddings, and private celebrations - " +
    "handling everything end to end, from concept and design to vendor curation, production, and on-ground " +
    "execution, across PAN India and at destination locations. Now booking the 2026 season.";

const ABOUT =
    "At BookUrEvents, we are the quiet force behind events people remember. From corporate conferences and " +
    "product launches to luxury weddings and private celebrations, our team blends meticulous planning with " +
    "on-ground precision, so the day feels seamless and entirely yours. With 5+ years of experience, 250+ " +
    "events delivered, 30+ cities served, and 99% client satisfaction, we craft moments that stay with you.";

const CONTACT = {
    phone: "+91 8700901115",
    email: "info@bookurevents.in",
    serviceArea: "PAN India & Destination",
    hours: "Mon to Sat, 10am to 7pm",
};

// Core navigable pages + on-page sections. Anchors verified against the home page
// (#about, #services, #process, #portfolio, #contact); team/testimonials have no anchor.
const KEY_PAGES = [
    { label: "Home", path: "/", note: "Luxury event planning & management across India - overview of BookUrEvents." },
    { label: "About", path: "/#about", note: "Who we are: a luxury event atelier blending meticulous planning with on-ground precision." },
    { label: "Services", path: "/#services", note: "Full suite of event services - corporate, weddings, private celebrations, and more." },
    { label: "Process", path: "/#process", note: "Our four-step method, from first idea to a flawless event day." },
    { label: "Portfolio", path: "/#portfolio", note: "Selected work across weddings, corporate, destination, decor, and entertainment." },
    { label: "Contact", path: "/#contact", note: "Start planning - enquiry form, phone, and email. We reply within 24 hours." },
    { label: "Feedback", path: "/feedback", note: "Share your experience with BookUrEvents." },
    { label: "Terms & Conditions", path: "/terms", note: "Terms governing bookings, payments, cancellations, privacy, and use of our services." },
];

// Four-step process. Curated here (the component does not export it) to keep llms output
// self-contained without editing unrelated UI files.
const PROCESS = [
    {
        title: "Discovery & Vision",
        description: "We begin with a conversation, understanding your vision, your guests, and the feeling you want in the room.",
        details: ["Consultation", "Vision alignment", "Budget framing"],
    },
    {
        title: "Design & Strategy",
        description: "We translate that vision into a complete concept, theme, layout, and a plan with nothing left to chance.",
        details: ["Concept & theme", "Vendor curation", "Timeline build"],
    },
    {
        title: "Production & Detailing",
        description: "Decor, lighting, catering, and entertainment come together with reviews and rehearsals before the day.",
        details: ["Decor & set", "Walkthroughs", "Final approvals"],
    },
    {
        title: "Flawless Event Day",
        description: "Our team runs everything on ground, managing every moment so you stay fully present in yours.",
        details: ["On ground crew", "Live management", "Guest experience"],
    },
];

// Short, plain-language summary of the legal page (full text lives at /terms).
const LEGAL_SUMMARY =
    "Covers acceptance of terms, scope of services, bookings & quotations, payments, cancellation & refunds, " +
    "postponement & force majeure, client responsibilities, third-party vendors, photography & IP, limitation of " +
    "liability, privacy & data (we do not sell your personal data), and governing law (India).";

function contactBlock(): string[] {
    return [
        `- Phone: ${CONTACT.phone} (${CONTACT.hours})`,
        `- Email: ${CONTACT.email}`,
        `- Service area: ${CONTACT.serviceArea}`,
        `- Enquiries: ${absoluteUrl("/#contact")}`,
    ];
}

/**
 * Concise markdown index - the standard llms.txt: brand, one-paragraph summary,
 * then linked, lightly-described sections.
 */
export async function buildLlmsTxt(): Promise<string> {
    const lines: string[] = [];

    lines.push(`# ${BRAND}`);
    lines.push("");
    lines.push(`> ${SUMMARY}`);
    lines.push("");

    lines.push("## Key Pages");
    for (const p of KEY_PAGES) {
        lines.push(`- [${cleanTitle(p.label)}](${absoluteUrl(p.path)}): ${p.note}`);
    }
    lines.push("");

    lines.push("## Services");
    for (const s of DATA.services) {
        lines.push(`- [${s.title}](${absoluteUrl("/#services")}): ${s.description}`);
    }
    lines.push("");

    lines.push("## Our Process");
    for (const step of PROCESS) {
        lines.push(`- [${step.title}](${absoluteUrl("/#process")}): ${step.description}`);
    }
    lines.push("");

    lines.push("## Portfolio");
    for (const g of DATA.gallery) {
        lines.push(`- [${g.title}](${absoluteUrl("/#portfolio")}): ${g.category} event`);
    }
    lines.push("");

    lines.push("## Team");
    for (const m of DATA.team) {
        lines.push(`- [${m.name}](${absoluteUrl("/")}): ${m.role}`);
    }
    lines.push("");

    lines.push("## Contact");
    lines.push(...contactBlock());
    lines.push("");

    lines.push("## Legal");
    lines.push(`- [Terms & Conditions](${absoluteUrl("/terms")}): ${LEGAL_SUMMARY}`);
    lines.push("");

    return lines.join("\n");
}

/**
 * Full markdown - same structure as buildLlmsTxt but with content inlined: the full
 * about narrative, every service with its feature list, the full process with details,
 * full team bios + expertise, all testimonials, and a legal summary. There is no
 * Portable Text / rich-text source here, so no rich-text serializer is needed.
 */
export async function buildLlmsFullTxt(): Promise<string> {
    const lines: string[] = [];

    lines.push(`# ${BRAND}`);
    lines.push("");
    lines.push(`> ${SUMMARY}`);
    lines.push("");
    lines.push(`Site: ${siteConfig.siteUrl}`);
    lines.push("");

    lines.push("## About");
    lines.push("");
    lines.push(ABOUT);
    lines.push("");

    lines.push("## Key Pages");
    for (const p of KEY_PAGES) {
        lines.push(`- [${cleanTitle(p.label)}](${absoluteUrl(p.path)}): ${p.note}`);
    }
    lines.push("");

    lines.push("## Services");
    lines.push("");
    for (const s of DATA.services) {
        lines.push(`### ${s.title}`);
        lines.push(`URL: ${absoluteUrl("/#services")}`);
        lines.push("");
        lines.push(s.description);
        if (s.features?.length) {
            lines.push("");
            lines.push("Includes:");
            for (const f of s.features) lines.push(`- ${f}`);
        }
        lines.push("");
    }

    lines.push("## Our Process");
    lines.push("");
    for (const step of PROCESS) {
        lines.push(`### ${step.title}`);
        lines.push("");
        lines.push(step.description);
        if (step.details?.length) {
            lines.push("");
            for (const d of step.details) lines.push(`- ${d}`);
        }
        lines.push("");
    }

    lines.push("## Portfolio");
    lines.push("");
    for (const g of DATA.gallery) {
        lines.push(`- **${g.title}** - ${g.category} (${absoluteUrl("/#portfolio")})`);
    }
    lines.push("");

    lines.push("## Team");
    lines.push("");
    for (const m of DATA.team) {
        lines.push(`### ${m.name} - ${m.role}`);
        lines.push("");
        lines.push(m.bio);
        if (m.expertise?.length) {
            lines.push("");
            lines.push(`Expertise: ${m.expertise.join(", ")}.`);
        }
        if (m.social?.email) {
            lines.push(`Contact: ${m.social.email}`);
        }
        lines.push("");
    }

    lines.push("## Testimonials");
    lines.push("");
    for (const t of DATA.testimonials) {
        lines.push(`> ${t.quote}`);
        lines.push(`> - ${t.name}, ${t.role}`);
        lines.push("");
    }

    lines.push("## Contact");
    lines.push("");
    lines.push(...contactBlock());
    lines.push("");

    lines.push("## Legal");
    lines.push("");
    lines.push(`### Terms & Conditions`);
    lines.push(`URL: ${absoluteUrl("/terms")}`);
    lines.push("");
    lines.push(LEGAL_SUMMARY);
    lines.push("");

    return lines.join("\n");
}
