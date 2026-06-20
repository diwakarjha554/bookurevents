"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
    Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
    FileText, FileSpreadsheet, FileType, FileDown, Download,
} from "lucide-react";
import { exportTable, type ExportFormat } from "@/lib/export";

export type Column<T> = {
    key: string;
    header: string;
    sortable?: boolean;
    /** Render a dropdown filter built from the column's distinct values. */
    filterable?: boolean;
    align?: "left" | "right" | "center";
    headerClassName?: string;
    cellClassName?: string;
    /** Raw value used for sort / search / filter / export. Defaults to row[key]. */
    value?: (row: T) => string | number | null | undefined;
    /** Custom cell display. Defaults to the raw value. */
    render?: (row: T) => ReactNode;
    /** Exclude from CSV/Excel/Word/PDF export (e.g. an actions column). */
    noExport?: boolean;
};

type Props<T> = {
    columns: Column<T>[];
    rows: T[];
    /** Base file name for exports (without extension). */
    exportName: string;
    exportTitle?: string;
    searchPlaceholder?: string;
    initialPageSize?: number;
    getRowKey?: (row: T, index: number) => string | number;
};

const PAGE_SIZES = [10, 25, 50, 100];

function rawValue<T>(col: Column<T>, row: T): string | number | null | undefined {
    if (col.value) return col.value(row);
    return (row as Record<string, unknown>)[col.key] as string | number | null | undefined;
}

const toText = (v: string | number | null | undefined) =>
    v === null || v === undefined ? "" : String(v);

export default function DataTable<T>({
    columns,
    rows,
    exportName,
    exportTitle,
    searchPlaceholder = "Search...",
    initialPageSize = 10,
    getRowKey,
}: Props<T>) {
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [page, setPage] = useState(1);

    // Distinct values for each filterable column.
    const filterOptions = useMemo(() => {
        const map: Record<string, string[]> = {};
        for (const col of columns) {
            if (!col.filterable) continue;
            const set = new Set<string>();
            for (const row of rows) {
                const t = toText(rawValue(col, row)).trim();
                if (t) set.add(t);
            }
            map[col.key] = Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        }
        return map;
    }, [columns, rows]);

    const processed = useMemo(() => {
        let out = rows;

        // Column filters
        for (const [key, val] of Object.entries(filters)) {
            if (!val) continue;
            const col = columns.find((c) => c.key === key);
            if (!col) continue;
            out = out.filter((r) => toText(rawValue(col, r)) === val);
        }

        // Global search across all columns
        const q = query.trim().toLowerCase();
        if (q) {
            out = out.filter((r) =>
                columns.some((c) => toText(rawValue(c, r)).toLowerCase().includes(q))
            );
        }

        // Sort
        if (sort) {
            const col = columns.find((c) => c.key === sort.key);
            if (col) {
                const dir = sort.dir === "asc" ? 1 : -1;
                out = [...out].sort((a, b) => {
                    const av = rawValue(col, a);
                    const bv = rawValue(col, b);
                    if (av === null || av === undefined || av === "") return 1;
                    if (bv === null || bv === undefined || bv === "") return -1;
                    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
                    return toText(av).localeCompare(toText(bv), undefined, { numeric: true }) * dir;
                });
            }
        }
        return out;
    }, [rows, columns, filters, query, sort]);

    const total = processed.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(page, pageCount);
    const start = (current - 1) * pageSize;
    const pageRows = processed.slice(start, start + pageSize);

    function toggleSort(key: string) {
        setPage(1);
        setSort((s) =>
            s?.key === key
                ? s.dir === "asc"
                    ? { key, dir: "desc" }
                    : null
                : { key, dir: "asc" }
        );
    }

    function doExport(format: ExportFormat) {
        const cols = columns.filter((c) => !c.noExport);
        exportTable(format, {
            filename: exportName,
            title: exportTitle,
            headers: ["#", ...cols.map((c) => c.header)],
            rows: processed.map((r, i) => [String(i + 1), ...cols.map((c) => toText(rawValue(c, r)))]),
        });
    }

    const alignClass = (a?: string) =>
        a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

    return (
        <div className="card-luxe overflow-hidden rounded-sm">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-3">
                    <div className="relative min-w-[200px] flex-1 lg:max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-soft" />
                        <input
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder={searchPlaceholder}
                            className="h-10 w-full rounded-sm border border-white/10 bg-ink/60 pl-9 pr-3 text-sm text-ivory placeholder:text-ivory-soft/60 focus:border-gold focus:outline-none"
                        />
                    </div>
                    {columns.filter((c) => c.filterable).map((c) => (
                        <select
                            key={c.key}
                            value={filters[c.key] ?? ""}
                            onChange={(e) => { setFilters((f) => ({ ...f, [c.key]: e.target.value })); setPage(1); }}
                            className="h-10 rounded-sm border border-white/10 bg-ink/60 px-3 text-sm text-ivory focus:border-gold focus:outline-none [&>option]:bg-ink"
                        >
                            <option value="">All {c.header}</option>
                            {(filterOptions[c.key] ?? []).map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    ))}
                </div>

                {/* Export */}
                <div className="flex items-center gap-1.5">
                    <span className="mr-1 hidden items-center gap-1 text-xs uppercase tracking-[0.14em] text-ivory-soft sm:flex">
                        <Download className="h-3.5 w-3.5" /> Export
                    </span>
                    <ExportBtn label="CSV" icon={<FileText className="h-3.5 w-3.5" />} onClick={() => doExport("csv")} />
                    <ExportBtn label="Excel" icon={<FileSpreadsheet className="h-3.5 w-3.5" />} onClick={() => doExport("excel")} />
                    <ExportBtn label="Word" icon={<FileType className="h-3.5 w-3.5" />} onClick={() => doExport("word")} />
                    <ExportBtn label="PDF" icon={<FileDown className="h-3.5 w-3.5" />} onClick={() => doExport("pdf")} />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.12em] text-gold">
                            <th className="px-4 py-3.5 font-semibold">#</th>
                            {columns.map((c) => (
                                <th key={c.key} className={`px-4 py-3.5 font-semibold ${alignClass(c.align)} ${c.headerClassName ?? ""}`}>
                                    {c.sortable ? (
                                        <button
                                            onClick={() => toggleSort(c.key)}
                                            className="inline-flex items-center gap-1.5 uppercase tracking-[0.12em] transition-colors hover:text-gold-soft"
                                        >
                                            {c.header}
                                            {sort?.key === c.key ? (
                                                sort.dir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                                            ) : (
                                                <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                                            )}
                                        </button>
                                    ) : (
                                        c.header
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-ivory-soft">
                                    No matching records.
                                </td>
                            </tr>
                        ) : (
                            pageRows.map((row, i) => (
                                <tr
                                    key={getRowKey ? getRowKey(row, start + i) : start + i}
                                    className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
                                >
                                    <td className="px-4 py-3.5 text-ivory-soft">{start + i + 1}</td>
                                    {columns.map((c) => (
                                        <td key={c.key} className={`px-4 py-3.5 align-top text-ivory ${alignClass(c.align)} ${c.cellClassName ?? ""}`}>
                                            {c.render ? c.render(row) : toText(rawValue(c, row))}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / pagination */}
            <div className="flex flex-col gap-3 border-t border-white/10 p-4 text-sm text-ivory-soft sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <span>
                        {total === 0 ? "0" : `${start + 1}–${Math.min(start + pageSize, total)}`} of {total}
                    </span>
                    <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        className="h-9 rounded-sm border border-white/10 bg-ink/60 px-2 text-xs text-ivory focus:border-gold focus:outline-none [&>option]:bg-ink"
                    >
                        {PAGE_SIZES.map((s) => (
                            <option key={s} value={s}>{s} / page</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={current <= 1}
                        className="inline-flex h-9 items-center gap-1 rounded-sm border border-white/10 px-3 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" /> Prev
                    </button>
                    <span className="px-1 text-ivory">Page {current} / {pageCount}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                        disabled={current >= pageCount}
                        className="inline-flex h-9 items-center gap-1 rounded-sm border border-white/10 px-3 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function ExportBtn({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            title={`Export as ${label}`}
            className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-2.5 py-2 text-xs text-ivory-soft transition-colors hover:border-gold hover:bg-gold hover:text-ink"
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}
