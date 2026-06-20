import type { ReactNode } from "react";

// Lightweight, dependency-free SVG charts themed to the BookUrEvents palette.
// Pure presentational components (no client JS) - tooltips use native <title>.

const GOLD = "#d4af37";
const GOLD_SOFT = "#e8cf8e";
const GOLD_DEEP = "#a87d23";
export const SERIES_COLORS = [GOLD, GOLD_SOFT, GOLD_DEEP, "#b9b2a6", "#7a6a2f", "#cdb15a"];

export function ChartCard({
    title,
    subtitle,
    action,
    children,
    className = "",
}: {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`card-luxe rounded-sm p-5 sm:p-6 ${className}`}>
            <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-display text-lg text-ivory">{title}</h3>
                    {subtitle && <p className="mt-0.5 text-xs text-ivory-soft">{subtitle}</p>}
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

type Point = { label: string; value: number };

/** Area + line chart for a single series over time. */
export function AreaChart({ data, height = 200 }: { data: Point[]; height?: number }) {
    const W = 640;
    const H = height;
    const padX = 8;
    const padY = 18;
    const innerW = W - padX * 2;
    const innerH = H - padY * 2;
    const max = Math.max(1, ...data.map((d) => d.value));
    const n = data.length;

    const x = (i: number) => padX + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1));
    const y = (v: number) => padY + innerH - (v / max) * innerH;

    const linePts = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
    const areaPath = `M ${x(0)},${padY + innerH} L ${data.map((d, i) => `${x(i)},${y(d.value)}`).join(" L ")} L ${x(n - 1)},${padY + innerH} Z`;
    const labelEvery = Math.ceil(n / 8);

    return (
        <div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet" style={{ height }}>
                <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
                        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* gridlines */}
                {[0.25, 0.5, 0.75].map((g) => (
                    <line key={g} x1={padX} x2={W - padX} y1={padY + innerH * g} y2={padY + innerH * g}
                        stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                ))}
                <path d={areaPath} fill="url(#areaFill)" />
                <polyline points={linePts} fill="none" stroke={GOLD} strokeWidth="2"
                    strokeLinejoin="round" strokeLinecap="round" />
                {data.map((d, i) => (
                    <g key={i}>
                        <circle cx={x(i)} cy={y(d.value)} r="3" fill={GOLD} />
                        <circle cx={x(i)} cy={y(d.value)} r="12" fill="transparent">
                            <title>{`${d.label}: ${d.value}`}</title>
                        </circle>
                    </g>
                ))}
            </svg>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wide text-ivory-soft">
                {data.map((d, i) => (
                    <span key={i} className={i % labelEvery === 0 || i === n - 1 ? "" : "opacity-0"}>
                        {d.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

/** Vertical bar chart for a single series. */
export function BarChart({ data, height = 200 }: { data: Point[]; height?: number }) {
    const max = Math.max(1, ...data.map((d) => d.value));
    const labelEvery = Math.ceil(data.length / 8);
    return (
        <div>
            <div className="flex items-end gap-1.5" style={{ height }}>
                {data.map((d, i) => (
                    <div key={i} className="group flex flex-1 flex-col items-center justify-end" title={`${d.label}: ${d.value}`}>
                        <div
                            className="w-full max-w-[34px] rounded-t-sm bg-gradient-to-t from-[#a87d23] to-[#e8cf8e] transition-opacity group-hover:opacity-80"
                            style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 3 : 0 }}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-2 flex gap-1.5 text-[10px] uppercase tracking-wide text-ivory-soft">
                {data.map((d, i) => (
                    <span key={i} className="flex-1 text-center">
                        {i % labelEvery === 0 || i === data.length - 1 ? d.label : ""}
                    </span>
                ))}
            </div>
        </div>
    );
}

type Slice = { label: string; value: number; color?: string };

/** Donut chart with legend. */
export function DonutChart({ data, size = 180 }: { data: Slice[]; size?: number }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    const r = 60;
    const c = 2 * Math.PI * r;
    let offset = 0;

    return (
        <div className="flex flex-wrap items-center gap-6">
            <svg viewBox="0 0 160 160" style={{ width: size, height: size }}>
                <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="20" />
                <g transform="rotate(-90 80 80)">
                    {total > 0 && data.map((d, i) => {
                        const frac = d.value / total;
                        const dash = frac * c;
                        const seg = (
                            <circle
                                key={i}
                                cx="80" cy="80" r={r} fill="none"
                                stroke={d.color ?? SERIES_COLORS[i % SERIES_COLORS.length]}
                                strokeWidth="20"
                                strokeDasharray={`${dash} ${c - dash}`}
                                strokeDashoffset={-offset}
                            >
                                <title>{`${d.label}: ${d.value} (${Math.round(frac * 100)}%)`}</title>
                            </circle>
                        );
                        offset += dash;
                        return seg;
                    })}
                </g>
                <text x="80" y="80" textAnchor="middle" dominantBaseline="central"
                    fill="#f4efe3" style={{ font: "600 22px var(--font-display, Georgia)" }}>
                    {total}
                </text>
            </svg>
            <ul className="space-y-2 text-sm">
                {data.map((d, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                        <span className="h-3 w-3 flex-shrink-0 rounded-sm"
                            style={{ background: d.color ?? SERIES_COLORS[i % SERIES_COLORS.length] }} />
                        <span className="text-ivory-soft">{d.label}</span>
                        <span className="font-medium text-ivory">{d.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
