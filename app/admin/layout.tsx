import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/guard";
import AdminNav from "@/components/admin/admin-nav";
import { logoutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
    title: "Admin",
    robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await requireAdmin();

    return (
        <div className="min-h-screen bg-ink text-ivory">
            <div className="lg:grid lg:grid-cols-[260px_1fr]">
                {/* Sidebar */}
                <aside className="lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-[rgba(212,175,55,0.16)] lg:bg-ink-soft">
                    <div className="hidden items-center gap-3 border-b border-[rgba(212,175,55,0.16)] p-6 lg:flex">
                        <Link href="/">
                            <Image
                                src="/logo_full_w.png"
                                alt="BookUrEvents"
                                width={1000000}
                                height={1000000}
                                quality={100}
                                className="h-[28px] w-36 object-contain"
                            />
                        </Link>
                    </div>
                    <div className="p-4">
                        <AdminNav />
                    </div>
                    <div className="hidden p-4 lg:block">
                        <div className="mb-3 truncate px-4 text-xs text-ivory-soft">
                            {session.user?.email}
                        </div>
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="flex w-full items-center gap-3 rounded-sm px-4 py-3 text-sm text-ivory-soft transition-colors hover:bg-white/5 hover:text-gold"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Content */}
                <main className="min-h-screen p-5 sm:p-8">
                    <div className="mx-auto max-w-6xl">{children}</div>
                    <div className="mx-auto mt-10 max-w-6xl lg:hidden">
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 text-sm text-ivory-soft hover:text-gold"
                            >
                                <LogOut className="h-4 w-4" /> Sign out
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
