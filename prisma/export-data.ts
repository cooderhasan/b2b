import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function exportData() {
    console.log("📦 Exporting data from local database...\n");

    const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
    const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    const products = await prisma.product.findMany({ include: { variants: true } });
    const sliders = await prisma.slider.findMany();
    const users = await prisma.user.findMany();
    const settings = await prisma.siteSettings.findMany();
    const discountGroups = await prisma.discountGroup.findMany();
    const references = await prisma.reference.findMany();
    const policies = await prisma.policy.findMany();

    const data = {
        categories,
        brands,
        products,
        sliders,
        users,
        settings,
        discountGroups,
        references,
        policies
    };

    fs.writeFileSync("prisma/exported_data.json", JSON.stringify(data, null, 2));
    console.log("✅ Data exported to prisma/exported_data.json");

    console.log("\n📊 Summary:");
    console.log(`  - Categories: ${categories.length}`);
    console.log(`  - Brands: ${brands.length}`);
    console.log(`  - Products: ${products.length}`);
    console.log(`  - Sliders: ${sliders.length}`);
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Settings: ${settings.length}`);
    console.log(`  - Discount Groups: ${discountGroups.length}`);
    console.log(`  - References: ${references.length}`);
    console.log(`  - Policies: ${policies.length}`);
}

exportData()
    .catch((e) => {
        console.error("❌ Export error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
