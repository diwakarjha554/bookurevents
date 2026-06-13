"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function toISO(d: Date) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

function pretty(d: Date) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

interface DatePickerProps {
    name: string;
    placeholder?: string;
    /** Disable dates before today. Default true. */
    disablePast?: boolean;
}

export function DatePicker({ name, placeholder = "Select a date", disablePast = true }: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Date | null>(null);
    const [view, setView] = useState(() => new Date());

    const rootRef = useRef<HTMLDivElement>(null);
    const hiddenRef = useRef<HTMLInputElement>(null);

    const today = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    // Close on outside click / Escape
    useEffect(() => {
        if (!open) return;
        function onDown(e: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    // Clear when the parent form resets
    useEffect(() => {
        const form = hiddenRef.current?.form;
        if (!form) return;
        const onReset = () => {
            setSelected(null);
            setView(new Date());
        };
        form.addEventListener("reset", onReset);
        return () => form.removeEventListener("reset", onReset);
    }, []);

    const year = view.getFullYear();
    const month = view.getMonth();
    const leading = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [
        ...Array.from({ length: leading }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ];

    const sameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    const pick = (d: Date) => {
        setSelected(d);
        setOpen(false);
    };

    return (
        <div ref={rootRef} className="relative">
            <input ref={hiddenRef} type="hidden" name={name} value={selected ? toISO(selected) : ""} readOnly />

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex h-12 w-full items-center justify-between border-b border-[rgba(244,239,227,0.18)] bg-transparent text-left text-ivory transition-colors focus:border-gold focus:outline-none"
            >
                <span className={selected ? "text-ivory" : "text-ivory-soft/60"}>
                    {selected ? pretty(selected) : placeholder}
                </span>
                <CalendarIcon className={`h-4 w-4 ${open ? "text-gold" : "text-ivory-soft"}`} />
            </button>

            {/* Popover */}
            {open && (
                <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(20rem,calc(100vw-3rem))] rounded-sm border border-[rgba(212,175,55,0.3)] bg-ink p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)]">
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                        <button
                            type="button"
                            aria-label="Previous month"
                            onClick={() => setView(new Date(year, month - 1, 1))}
                            className="grid h-8 w-8 place-items-center rounded-full border border-[rgba(212,175,55,0.25)] text-gold transition-colors hover:bg-[rgba(212,175,55,0.12)]"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="font-display text-base text-ivory">
                            {MONTHS[month]} <span className="text-gold">{year}</span>
                        </div>
                        <button
                            type="button"
                            aria-label="Next month"
                            onClick={() => setView(new Date(year, month + 1, 1))}
                            className="grid h-8 w-8 place-items-center rounded-full border border-[rgba(212,175,55,0.25)] text-gold transition-colors hover:bg-[rgba(212,175,55,0.12)]"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Weekdays */}
                    <div className="mb-1 grid grid-cols-7 gap-1">
                        {WEEKDAYS.map((d) => (
                            <div key={d} className="py-1 text-center text-[10px] uppercase tracking-[0.1em] text-ivory-soft">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((d, i) => {
                            if (!d) return <div key={`e${i}`} />;
                            const isSelected = selected && sameDay(d, selected);
                            const isToday = sameDay(d, today);
                            const isDisabled = disablePast && d < today;
                            return (
                                <button
                                    key={toISO(d)}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => pick(d)}
                                    className={[
                                        "mx-auto grid h-9 w-9 place-items-center rounded-full text-sm transition-colors",
                                        isSelected
                                            ? "bg-gold font-semibold text-ink"
                                            : isToday
                                                ? "border border-gold/50 text-gold hover:bg-[rgba(212,175,55,0.12)]"
                                                : "text-ivory hover:bg-[rgba(212,175,55,0.14)]",
                                        isDisabled ? "cursor-not-allowed text-ivory-soft/25 hover:bg-transparent" : "",
                                    ].join(" ")}
                                >
                                    {d.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                        <button
                            type="button"
                            onClick={() => {
                                setSelected(null);
                                setOpen(false);
                            }}
                            className="text-xs uppercase tracking-[0.12em] text-ivory-soft transition-colors hover:text-gold"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setView(new Date());
                                pick(today);
                            }}
                            className="text-xs uppercase tracking-[0.12em] text-gold transition-colors hover:text-gold-soft"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
