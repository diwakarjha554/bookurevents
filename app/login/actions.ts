"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, fd: FormData): Promise<LoginState> {
    try {
        await signIn("credentials", {
            email: String(fd.get("email") || ""),
            password: String(fd.get("password") || ""),
            redirectTo: "/admin",
        });
        return {};
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Invalid email or password." };
        }
        // re-throw the redirect (NEXT_REDIRECT) so navigation happens
        throw error;
    }
}
