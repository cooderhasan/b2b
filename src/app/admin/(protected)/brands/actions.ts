"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function getBrands() {
    return prisma.brand.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { products: true },
            },
        },
    });
}

export async function createBrand(data: { name: string; logoUrl?: string }) {
    await prisma.brand.create({
        data: {
            name: data.name,
            slug: slugify(data.name),
            logoUrl: data.logoUrl,
        },
    });
    revalidatePath("/admin/brands");
}

export async function updateBrand(id: string, data: { name?: string; logoUrl?: string; isActive?: boolean }) {
    const updateData: { name?: string; slug?: string; logoUrl?: string; isActive?: boolean } = { ...data };
    if (data.name) {
        updateData.slug = slugify(data.name);
    }
    await prisma.brand.update({
        where: { id },
        data: updateData,
    });
    revalidatePath("/admin/brands");
}

export async function deleteBrand(id: string) {
    await prisma.brand.delete({
        where: { id },
    });
    revalidatePath("/admin/brands");
}
