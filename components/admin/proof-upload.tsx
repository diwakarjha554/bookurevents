"use client";

import { useActionState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";
import { uploadPaymentProof } from "@/app/admin/actions";

export default function ProofUpload({ memberId }: { memberId: string }) {
    const [state, action, pending] = useActionState(uploadPaymentProof, {} as { ok?: boolean; error?: string });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.ok) {
            toast.success("Payment proof uploaded.");
            formRef.current?.reset();
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form ref={formRef} action={action} className="flex items-center gap-2">
            <input type="hidden" name="memberId" value={memberId} />
            <input
                name="proof"
                type="file"
                accept="image/*,application/pdf"
                required
                className="block w-full text-xs text-ivory-soft file:mr-2 file:cursor-pointer file:rounded-none file:border-0 file:bg-[rgba(212,175,55,0.15)] file:px-3 file:py-1.5 file:text-gold"
            />
            <button
                type="submit"
                disabled={pending}
                className="btn-gold flex items-center gap-1 rounded-none px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] disabled:opacity-70"
            >
                {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            </button>
        </form>
    );
}
