import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Non-public areas kept out of all crawlers.
const DISALLOW = ["/api/", "/admin/", "/login"];

// AI assistants / answer engines we explicitly welcome (same access as everyone else).
const AI_CRAWLERS = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "Amazonbot",
    "Bytespider",
    "CCBot",
    "DuckAssistBot",
    "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: DISALLOW,
            },
            {
                userAgent: AI_CRAWLERS,
                allow: "/",
                disallow: DISALLOW,
            },
        ],
        sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
        host: siteConfig.siteUrl,
    };
}
