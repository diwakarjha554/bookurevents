"use client";

import { useActionState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Loader2, CalendarPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createEvent } from "@/app/admin/actions";

const field =
    "rounded-none border-0 border-b border-[rgba(244,239,227,0.18)] bg-transparent px-0 text-ivory shadow-none placeholder:text-ivory-soft/50 focus-visible:border-gold focus-visible:ring-0 h-11";
const label = "block text-xs uppercase tracking-[0.14em] text-ivory-soft";

export default function EventForm() {
    const [state, action, pending] = useActionState(createEvent, {} as { ok?: boolean; error?: string });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.ok) {
            toast.success("Event created.");
            formRef.current?.reset();
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form ref={formRef} action={action} className="card-luxe rounded-sm p-6">
            <h3 className="font-display text-xl text-ivory">Create an event</h3>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className={label}>Title *</label>
                    <Input name="title" required placeholder="e.g. Sharma Wedding" className={field} />
                </div>
                <div className="space-y-2">
                    <label className={label}>Date *</label>
                    <Input name="date" type="datetime-local" required className={`${field} [color-scheme:dark]`} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <label className={label}>Venue</label>
                    <Input name="venue" placeholder="Venue / location" className={field} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <label className={label}>Description</label>
                    <Textarea
                        name="description"
                        rows={3}
                        placeholder="Brief about the event..."
                        className="resize-none rounded-none border-0 border-b border-[rgba(244,239,227,0.18)] bg-transparent px-0 text-ivory shadow-none placeholder:text-ivory-soft/50 focus-visible:border-gold focus-visible:ring-0"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={pending}
                className="btn-gold mt-7 rounded-none px-6 py-5 text-sm font-semibold uppercase tracking-[0.12em] disabled:opacity-70"
            >
                {pending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <CalendarPlus className="mr-1 h-4 w-4" />}
                Create Event
            </Button>
        </form>
    );
}
