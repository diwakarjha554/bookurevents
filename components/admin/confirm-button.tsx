"use client";

import type { ReactNode } from "react";

export default function ConfirmButton({
    action,
    message = "Are you sure?",
    children,
    className = "",
}: {
    action: () => void | Promise<void>;
    message?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <form
            action={action}
            onSubmit={(e) => {
                if (!confirm(message)) e.preventDefault();
            }}
        >
            <button type="submit" className={className}>
                {children}
            </button>
        </form>
    );
}
