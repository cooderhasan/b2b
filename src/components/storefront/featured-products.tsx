import Link from "next/link";
import { ProductCard } from "./product-card";
import { ArrowRight } from "lucide-react";
import type { Decimal } from "@prisma/client/runtime/library";

interface Product {
    id: string;
    name: string;
    slug: string;
    images: string[];
    listPrice: number;
    vatRate: number;
    minQuantity: number;
    stock: number;
    category: {
        name: string;
        slug: string;
    } | null;
}

interface FeaturedProductsProps {
    title: string;
    products: Product[];
    discountRate: number;
    isDealer: boolean;
    badge?: string;
}

export function FeaturedProducts({
    title,
    products,
    discountRate,
    isDealer,
    badge,
}: FeaturedProductsProps) {
    return (
        <section className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h2>
                <Link
                    href="/products"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                    Tümünü Gör
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                            ...product,
                            listPrice: product.listPrice,
                        }}
                        discountRate={discountRate}
                        isDealer={isDealer}
                        badge={badge}
                    />
                ))}
            </div>
        </section>
    );
}
