"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/app/login/actions";

const Login = () => {
    const [state, formAction, pending] = useActionState(loginAction, {});

    return (
        <main className='grain relative flex h-screen items-center justify-center overflow-hidden bg-ink'>
            <div className="glow left-[-10%] top-[10%] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(212,175,55,0.16),transparent_70%)]" />
            <div className="glow bottom-[5%] right-[-8%] h-[460px] w-[460px] bg-[radial-gradient(circle,rgba(212,175,55,0.10),transparent_70%)]" />

            <Link
                href={'/'}
                className='group absolute left-7 top-7 z-50 flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-ivory-soft transition-colors hover:text-gold'
            >
                <ArrowLeft size={18} className='transition-transform group-hover:-translate-x-1' />
                Back
            </Link>

            <div className='relative z-10 w-full max-w-md px-5'>
                <div className='card-luxe rounded-sm p-8 sm:p-10'>
                    <div className='flex flex-col items-center text-center'>
                        <Image
                            src="/logo_full_w.png"
                            alt="BookUrEvents"
                            width={1279}
                            height={240}
                            quality={100}
                            className='h-10 w-auto object-contain'
                        />
                        <span className='eyebrow mt-6'>Admin Access</span>
                        <h1 className='font-display mt-3 text-3xl font-light text-ivory'>
                            Sign in to your <span className='text-gold-grad italic'>account</span>
                        </h1>
                    </div>

                    <form action={formAction} className='mt-9 flex flex-col gap-6'>
                        <div className='space-y-2'>
                            <label className='block text-xs uppercase tracking-[0.16em] text-ivory-soft'>Email</label>
                            <Input
                                name="email"
                                placeholder="you@example.com"
                                type='email'
                                required
                                className="h-12 rounded-none border-0 border-b border-[rgba(244,239,227,0.18)] bg-transparent px-0 text-ivory shadow-none placeholder:text-ivory-soft/60 focus-visible:border-gold focus-visible:ring-0"
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-xs uppercase tracking-[0.16em] text-ivory-soft'>Password</label>
                            <Input
                                name="password"
                                placeholder="Enter your password"
                                type='password'
                                required
                                className="h-12 rounded-none border-0 border-b border-[rgba(244,239,227,0.18)] bg-transparent px-0 text-ivory shadow-none placeholder:text-ivory-soft/60 focus-visible:border-gold focus-visible:ring-0"
                            />
                        </div>

                        {state?.error && (
                            <p className="text-sm text-red-400">{state.error}</p>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            disabled={pending}
                            className="btn-gold mt-2 w-full rounded-none py-6 text-sm font-semibold uppercase tracking-[0.14em] disabled:opacity-70"
                        >
                            {pending ? (
                                <>
                                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Login;
