import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
    title,
    subtitle,
    action,
}: {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 className="font-display text-3xl text-ivory">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-ivory-soft">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`card-luxe rounded-sm ${className}`}>{children}</div>;
}

export function EmptyState({ message }: { message: string }) {
    return (
        <div className="card-luxe rounded-sm p-12 text-center text-ivory-soft">{message}</div>
    );
}

export function DbNotice() {
    return (
        <div className="rounded-sm border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.06)] p-6">
            <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                <div>
                    <h3 className="font-medium text-ivory">Database not connected yet</h3>
                    <p className="mt-1 text-sm text-ivory-soft">
                        Add your PostgreSQL <code className="text-gold">DATABASE_URL</code> to{" "}
                        <code className="text-gold">.env</code>, then run{" "}
                        <code className="text-gold">pnpm db:push</code> and{" "}
                        <code className="text-gold">pnpm db:seed</code>. This data will appear here once connected.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function StatCard({
    label,
    value,
    href,
    icon,
    hint,
}: {
    label: string;
    value: number | string;
    href?: string;
    icon?: ReactNode;
    hint?: string;
}) {
    const inner = (
        <div className="card-luxe h-full rounded-sm p-6 transition-colors hover:border-[rgba(212,175,55,0.45)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="font-display text-4xl text-ivory">{value}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.16em] text-gold">{label}</div>
                    {hint && <div className="mt-1 text-xs text-ivory-soft">{hint}</div>}
                </div>
                {icon && (
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border border-[rgba(212,175,55,0.3)] text-gold">
                        {icon}
                    </span>
                )}
            </div>
        </div>
    );
    return href ? <a href={href} className="block">{inner}</a> : inner;
}
