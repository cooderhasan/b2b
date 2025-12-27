import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    const [product, categories, brands] = await Promise.all([
        prisma.product.findUnique({
            where: { id },
            include: {
                variants: true,
            },
        }),
        prisma.category.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        }),
        prisma.brand.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
        }),
    ]);

    if (!product) {
        notFound();
    }

    // Serialize product data for client component
    const serializedProduct = {
        ...product,
        listPrice: product.listPrice.toNumber(),
        variants: product.variants.map((v) => ({
            ...v,
            priceAdjustment: v.priceAdjustment.toNumber(),
        })),
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ürün Düzenle
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    {product.name}
                </p>
            </div>

            <ProductForm
                categories={categories}
                brands={brands}
                product={serializedProduct}
            />
        </div>
    );
}

