import { auth } from "@/auth";
import { redirect } from "next/navigation";

/** Ensure the current request is an authenticated ADMIN. Redirects to /login otherwise. */
export async function requireAdmin() {
    const session = await auth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role;
    if (!session?.user || role !== "ADMIN") {
        redirect("/login");
    }
    return session;
}
