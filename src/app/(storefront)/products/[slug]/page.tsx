import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/storefront/product-detail";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const session = await auth();
    const settings = await getSiteSettings();
    const discountRate = session?.user?.discountRate || 0;
    const isDealer =
        (session?.user?.role === "DEALER" && session?.user?.status === "APPROVED") ||
        session?.user?.role === "ADMIN" ||
        session?.user?.role === "OPERATOR";
    const isAuthenticated = !!session?.user;

    const product = await prisma.product.findUnique({
        where: { slug, isActive: true },
        include: {
            category: true,
            variants: {
                where: { isActive: true },
            },
        },
    });

    if (!product) {
        notFound();
    }

    console.log("Product slug:", slug);
    console.log("Product origin from DB:", product.origin);
    console.log("Product variants count:", product.variants.length);

    // Get related products
    const relatedProducts = await prisma.product.findMany({
        where: {
            isActive: true,
            categoryId: product.categoryId,
            id: { not: product.id },
        },
        include: { category: true },
        take: 4,
    });

    // Serialize product with variants
    const serializedProduct = {
        ...product,
        listPrice: Number(product.listPrice),
        origin: product.origin, // Explicitly pass origin
        variants: product.variants.map(v => ({
            id: v.id,
            color: v.color,
            size: v.size,
            stock: v.stock,
            sku: v.sku,
            barcode: v.barcode,
            priceAdjustment: Number(v.priceAdjustment),
        })),
    };

    return (
        <ProductDetail
            product={serializedProduct}
            relatedProducts={relatedProducts.map(p => ({
                ...p,
                listPrice: Number(p.listPrice),
                origin: p.origin, // Explicitly pass origin
            }))}
            discountRate={discountRate}
            isDealer={isDealer}
            isAuthenticated={isAuthenticated}
            whatsappNumber={settings.whatsappNumber}
        />
    );
}

