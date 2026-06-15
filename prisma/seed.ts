import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = (process.env.ADMIN_EMAIL || "admin@bookurevents.in").toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    const name = process.env.ADMIN_NAME || "BookUrEvents Admin";

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: { role: "ADMIN", name },
        create: { email, name, passwordHash, role: "ADMIN" },
    });

    console.log(`✔ Admin ready: ${admin.email}`);
    console.log("  (log in at /login with the ADMIN_EMAIL / ADMIN_PASSWORD from your .env)");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
