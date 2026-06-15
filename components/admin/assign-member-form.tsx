"use client";

import { useActionState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { assignMember } from "@/app/admin/actions";

const field =
    "rounded-none border-0 border-b border-[rgba(244,239,227,0.18)] bg-transparent px-0 text-ivory shadow-none focus-visible:border-gold focus-visible:ring-0 h-11";
const label = "block text-xs uppercase tracking-[0.14em] text-ivory-soft";

export default function AssignMemberForm({
    eventId,
    agents,
}: {
    eventId: string;
    agents: { id: string; name: string }[];
}) {
    const [state, action, pending] = useActionState(assignMember, {} as { ok?: boolean; error?: string });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.ok) {
            toast.success("Agent assigned. Email sent with event details.");
            formRef.current?.reset();
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    if (agents.length === 0) {
        return (
            <p className="text-sm text-ivory-soft">
                All agents are already assigned, or you have no agents yet.
            </p>
        );
    }

    return (
        <form ref={formRef} action={action} className="grid items-end gap-5 sm:grid-cols-[1fr_160px_auto]">
            <input type="hidden" name="eventId" value={eventId} />
            <div className="space-y-2">
                <label className={label}>Agent</label>
                <select
                    name="userId"
                    required
                    defaultValue=""
                    className={`${field} w-full [&>option]:bg-ink`}
                >
                    <option value="" disabled>Select an agent</option>
                    {agents.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
                <label className={label}>Pay (₹)</label>
                <Input name="pay" type="number" min="0" defaultValue="0" className={field} />
            </div>
            <Button
                type="submit"
                disabled={pending}
                className="btn-gold rounded-none px-6 py-5 text-sm font-semibold uppercase tracking-[0.12em] disabled:opacity-70"
            >
                {pending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <UserPlus className="mr-1 h-4 w-4" />}
                Assign
            </Button>
        </form>
    );
}
