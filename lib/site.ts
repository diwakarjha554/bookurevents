// Central site configuration. Reused by app/sitemap.ts, app/robots.ts, and the
// llms.txt generators (lib/llms.ts). Keep canonical URL + brand in one place.

export const siteConfig = {
    siteName: "BookUrEvents",
    // Canonical production URL. Override via NEXT_PUBLIC_SITE_URL without a code change.
    // Trailing slash is stripped so absoluteUrl() never produces a double slash.
    siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bookurevents.in").replace(/\/+$/, ""),
    description:
        "BookUrEvents is a premium event management company crafting unforgettable corporate events, luxury weddings, and private celebrations across India - from concept to flawless execution.",
} as const;

/** Build an absolute URL from a site-relative path (e.g. "/terms" or "/#services"). */
export function absoluteUrl(path = "/"): string {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${siteConfig.siteUrl}${p}`;
}
