"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

export default function NewsletterForm() {
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const email = String(new FormData(form).get("email") || "");
        setLoading(true);
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Failed to subscribe");
            toast.success("You are subscribed. Thank you!");
            form.reset();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="flex gap-3">
            <Input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="h-12 rounded-none border-0 border-b border-[rgba(244,239,227,0.25)] bg-transparent px-0 text-ivory shadow-none placeholder:text-ivory-soft/60 focus-visible:border-gold focus-visible:ring-0"
            />
            <Button type="submit" disabled={loading} className="btn-gold rounded-none px-6 font-semibold disabled:opacity-70">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            </Button>
        </form>
    );
}
