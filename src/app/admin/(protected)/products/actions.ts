"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/helpers";

export async function createProduct(formData: FormData) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR")) {
        throw new Error("Unauthorized");
    }

    const rawData = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string || generateSlug(formData.get("name") as string),
        sku: (formData.get("sku") as string) || undefined,
        barcode: (formData.get("barcode") as string) || undefined,
        brandId: (formData.get("brandId") as string) === "none" ? undefined : (formData.get("brandId") as string) || undefined,
        origin: (formData.get("origin") as string) || undefined,
        description: formData.get("description") as string || undefined,
        listPrice: Number(formData.get("listPrice")),
        vatRate: Number(formData.get("vatRate")),
        minQuantity: Number(formData.get("minQuantity")) || 1,
        stock: Number(formData.get("stock")) || 0,
        categoryId: (formData.get("categoryId") as string) === "none" ? undefined : (formData.get("categoryId") as string) || undefined,
        isFeatured: formData.get("isFeatured") === "on",
        isNew: formData.get("isNew") === "on",
        isBestSeller: formData.get("isBestSeller") === "on",
        isActive: formData.get("isActive") !== "off",
    };

    const validatedData = productSchema.parse(rawData);

    // Parse images from JSON string
    const imagesJson = formData.get("images") as string;
    const images: string[] = imagesJson ? JSON.parse(imagesJson) : [];

    // Parse variants from JSON string
    const variantsJson = formData.get("variants") as string;
    const variants = variantsJson ? JSON.parse(variantsJson) : [];

    const product = await prisma.product.create({
        data: {
            ...validatedData,
            images,
        },
    });

    // Create variants separately
    if (variants.length > 0) {
        await prisma.productVariant.createMany({
            data: variants.map((v: { color?: string; size?: string; sku?: string; barcode?: string; stock?: number; priceAdjustment?: number; isActive?: boolean }) => ({
                productId: product.id,
                color: v.color || null,
                size: v.size || null,
                sku: v.sku || null,
                barcode: v.barcode || null,
                stock: v.stock || 0,
                priceAdjustment: v.priceAdjustment || 0,
                isActive: v.isActive !== false,
            })),
        });
    }

    await prisma.adminLog.create({
        data: {
            adminId: session.user.id,
            action: "CREATE_PRODUCT",
            entityType: "Product",
            entityId: product.id,
            newData: validatedData,
        },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
}

export async function updateProduct(productId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR")) {
        throw new Error("Unauthorized");
    }

    const oldProduct = await prisma.product.findUnique({ where: { id: productId } });

    console.log("--- Update Product Started ---");
    console.log("ProductId:", productId);
    // Log all form data keys to see what's coming in
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    const rawData = {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        sku: (formData.get("sku") as string) || undefined,
        barcode: (formData.get("barcode") as string) || undefined,
        brandId: (formData.get("brandId") as string) === "none" ? undefined : (formData.get("brandId") as string) || undefined,
        origin: (formData.get("origin") as string) || undefined,
        description: formData.get("description") as string || undefined,
        listPrice: Number(formData.get("listPrice")),
        vatRate: Number(formData.get("vatRate")),
        minQuantity: Number(formData.get("minQuantity")) || 1,
        stock: Number(formData.get("stock")) || 0,
        categoryId: (formData.get("categoryId") as string) === "none" ? undefined : (formData.get("categoryId") as string) || undefined,
        isFeatured: formData.get("isFeatured") === "on",
        isNew: formData.get("isNew") === "on",
        isBestSeller: formData.get("isBestSeller") === "on",
        isActive: formData.get("isActive") !== "off",
    };

    const validatedData = productSchema.parse(rawData);

    // Parse images from JSON string
    const imagesJson = formData.get("images") as string;
    const images: string[] = imagesJson ? JSON.parse(imagesJson) : [];

    // Parse variants from JSON string
    const variantsJson = formData.get("variants") as string;
    const variants = variantsJson ? JSON.parse(variantsJson) : [];

    // Delete existing variants and recreate
    await prisma.productVariant.deleteMany({
        where: { productId },
    });

    await prisma.product.update({
        where: { id: productId },
        data: {
            ...validatedData,
            images,
        },
    });

    // Create new variants
    if (variants.length > 0) {
        await prisma.productVariant.createMany({
            data: variants.map((v: { color?: string; size?: string; sku?: string; barcode?: string; stock?: number; priceAdjustment?: number; isActive?: boolean }) => ({
                productId,
                color: v.color || null,
                size: v.size || null,
                sku: v.sku || null,
                barcode: v.barcode || null,
                stock: v.stock || 0,
                priceAdjustment: v.priceAdjustment || 0,
                isActive: v.isActive !== false,
            })),
        });
    }

    await prisma.adminLog.create({
        data: {
            adminId: session.user.id,
            action: "UPDATE_PRODUCT",
            entityType: "Product",
            entityId: productId,
            oldData: oldProduct,
            newData: validatedData,
        },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${validatedData.slug}`);
    revalidatePath("/");

    return { success: true };
}

export async function deleteProduct(productId: string) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR")) {
        throw new Error("Unauthorized");
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    await prisma.product.delete({ where: { id: productId } });

    await prisma.adminLog.create({
        data: {
            adminId: session.user.id,
            action: "DELETE_PRODUCT",
            entityType: "Product",
            entityId: productId,
            oldData: product,
        },
    });

    revalidatePath("/admin/products");
}

export async function toggleProductStatus(productId: string, isActive: boolean) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR")) {
        throw new Error("Unauthorized");
    }

    await prisma.product.update({
        where: { id: productId },
        data: { isActive },
    });

    revalidatePath("/admin/products");
}
