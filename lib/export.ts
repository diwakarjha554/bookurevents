// Dependency-free table export helpers used by the admin DataTable.
// CSV  -> real .csv (UTF-8 BOM so Excel reads accents correctly)
// Excel-> .xls (HTML table with the ms-excel MIME; opens natively in Excel/LibreOffice)
// Word -> .doc (HTML with the msword MIME; opens natively in Word)
// PDF  -> a styled print window; the browser's "Save as PDF" produces the file

export type ExportFormat = "csv" | "excel" | "word" | "pdf";

export interface ExportData {
    /** Base file name without extension. */
    filename: string;
    /** Column headers. */
    headers: string[];
    /** Row cells as plain strings, aligned to `headers`. */
    rows: string[][];
    /** Optional document title shown in Word/PDF output. */
    title?: string;
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const escHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function csvCell(s: string) {
    // Quote when the value contains a comma, quote, or newline.
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

function buildTableHtml({ headers, rows, title }: ExportData) {
    const head = headers.map((h) => `<th>${escHtml(h)}</th>`).join("");
    const body = rows
        .map((r) => `<tr>${r.map((c) => `<td>${escHtml(c ?? "")}</td>`).join("")}</tr>`)
        .join("");
    return `
        ${title ? `<h2 style="font-family:Georgia,serif;color:#a87d23">${escHtml(title)}</h2>` : ""}
        <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px">
            <thead>
                <tr style="background:#d4af37;color:#0a0a0b;text-align:left">${head}</tr>
            </thead>
            <tbody>${body}</tbody>
        </table>`;
}

export function exportTable(format: ExportFormat, data: ExportData) {
    const { filename, headers, rows, title } = data;

    if (format === "csv") {
        const lines = [headers, ...rows].map((r) => r.map((c) => csvCell(c ?? "")).join(","));
        const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
        downloadBlob(blob, `${filename}.csv`);
        return;
    }

    if (format === "excel") {
        const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body>${buildTableHtml(data)}</body></html>`;
        const blob = new Blob(["﻿" + html], { type: "application/vnd.ms-excel;charset=utf-8;" });
        downloadBlob(blob, `${filename}.xls`);
        return;
    }

    if (format === "word") {
        const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${escHtml(title ?? filename)}</title></head><body>${buildTableHtml(data)}</body></html>`;
        const blob = new Blob(["﻿" + html], { type: "application/msword;charset=utf-8;" });
        downloadBlob(blob, `${filename}.doc`);
        return;
    }

    // pdf - open a print window; the user picks "Save as PDF".
    const win = window.open("", "_blank", "width=1024,height=768");
    if (!win) {
        alert("Please allow pop-ups to export as PDF.");
        return;
    }
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escHtml(title ?? filename)}</title>
        <style>
            body{margin:24px;color:#111}
            h2{font-family:Georgia,serif;color:#a87d23;margin:0 0 16px}
            table{border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:11px}
            th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;vertical-align:top}
            thead tr{background:#d4af37;color:#0a0a0b}
            tr:nth-child(even) td{background:#faf7ef}
            @media print{@page{margin:14mm}}
        </style></head><body>${buildTableHtml(data)}</body></html>`);
    win.document.close();
    win.focus();
    // Give the new document a tick to lay out before printing.
    setTimeout(() => win.print(), 350);
}
