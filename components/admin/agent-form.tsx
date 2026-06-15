"use client";

import { useActionState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createAgent } from "@/app/admin/actions";

const field =
    "rounded-none border-0 border-b border-[rgba(244,239,227,0.18)] bg-transparent px-0 text-ivory shadow-none placeholder:text-ivory-soft/50 focus-visible:border-gold focus-visible:ring-0 h-11";
const label = "block text-xs uppercase tracking-[0.14em] text-ivory-soft";

export default function AgentForm() {
    const [state, action, pending] = useActionState(createAgent, {} as { ok?: boolean; error?: string });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.ok) {
            toast.success("Agent created.");
            formRef.current?.reset();
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form ref={formRef} action={action} className="card-luxe rounded-sm p-6">
            <h3 className="font-display text-xl text-ivory">Add an agent</h3>
            <p className="mt-1 text-sm text-ivory-soft">Create a login for a team member and store their payment details.</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className={label}>Full Name *</label>
                    <Input name="name" required placeholder="Full name" className={field} />
                </div>
                <div className="space-y-2">
                    <label className={label}>Email *</label>
                    <Input name="email" type="email" required placeholder="agent@example.com" className={field} />
                </div>
                <div className="space-y-2">
                    <label className={label}>Phone</label>
                    <Input name="phone" placeholder="+91 00000 00000" className={field} />
                </div>
                <div className="space-y-2">
                    <label className={label}>UPI ID</label>
                    <Input name="upiId" placeholder="name@bank" className={field} />
                </div>
                <div className="space-y-2">
                    <label className={label}>Temporary Password *</label>
                    <Input name="password" type="text" required placeholder="Set a password" className={field} />
                </div>
                <div className="space-y-2">
                    <label className={label}>Payment QR Code (image)</label>
                    <input
                        name="qrCode"
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-ivory-soft file:mr-3 file:cursor-pointer file:rounded-none file:border-0 file:bg-[rgba(212,175,55,0.15)] file:px-4 file:py-2 file:text-gold"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={pending}
                className="btn-gold mt-7 rounded-none px-6 py-5 text-sm font-semibold uppercase tracking-[0.12em] disabled:opacity-70"
            >
                {pending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <UserPlus className="mr-1 h-4 w-4" />}
                Create Agent
            </Button>
        </form>
    );
}
