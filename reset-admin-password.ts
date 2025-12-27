import "dotenv/config";
import { prisma } from "./src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
    const email = "admin@b2b.com";
    const password = "admin123";

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists, if not create it
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash: hashedPassword,
            role: "ADMIN",
            status: "APPROVED"
        },
        create: {
            email,
            passwordHash: hashedPassword,
            role: "ADMIN",
            status: "APPROVED",
            companyName: "B2B Admin"
        }
    });

    console.log("Admin user updated:", { email: user.email, role: user.role });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
