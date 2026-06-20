import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Regenerate the sitemap hourly.
export const revalidate = 3600;

// Public, indexable routes only. The Prisma models (Event/EventMember/etc.) power an
// internal admin CRM - events have no slug and no public detail page - so there are no
// public dynamic routes to enumerate. /login, /admin/*, and /api/* are intentionally
// excluded (they are non-public and disallowed in robots.ts).
const STATIC_ROUTES: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
}> = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/feedback", changeFrequency: "monthly", priority: 0.5 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    const seen = new Set<string>();
    const entries: MetadataRoute.Sitemap = [];

    const add = (url: string, rest: Omit<MetadataRoute.Sitemap[number], "url">) => {
        if (seen.has(url)) return;
        seen.add(url);
        entries.push({ url, ...rest });
    };

    // Static public pages.
    for (const route of STATIC_ROUTES) {
        add(absoluteUrl(route.path), {
            lastModified,
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        });
    }

    // Dynamic CMS-backed routes would be appended here. This project has none today;
    // when one is added, wrap its fetch in try/catch so the static routes above still
    // emit if the data source is unreachable. Example:
    //
    //   try {
    //     const posts = await getPosts();
    //     for (const post of posts) {
    //       add(absoluteUrl(`/blog/${post.slug}`), {
    //         lastModified: new Date(post.updatedAt),
    //         changeFrequency: "monthly",
    //         priority: 0.6,
    //       });
    //     }
    //   } catch {
    //     // Swallow - keep the static sitemap valid even if the CMS is down.
    //   }

    return entries;
}
