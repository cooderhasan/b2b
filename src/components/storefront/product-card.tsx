"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculatePrice } from "@/lib/helpers";
import { ShoppingCart, Eye } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
    _count?: {
        variants: number;
    };
}

interface ProductCardProps {
    product: Product;
    discountRate: number;
    isDealer: boolean;
    badge?: string;
}

export function ProductCard({
    product,
    discountRate,
    isDealer,
    badge,
}: ProductCardProps) {
    const { addItem } = useCartStore();
    const price = calculatePrice(
        product.listPrice,
        discountRate,
        product.vatRate
    );

    const hasVariants = product._count?.variants && product._count.variants > 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();

        if (hasVariants) {
            // Should not happen if UI is correct, but just in case
            return;
        }

        addItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0],
            quantity: product.minQuantity || 1,
            listPrice: product.listPrice,
            vatRate: product.vatRate,
            stock: product.stock,
            minQuantity: product.minQuantity,
            discountRate: discountRate,
        });

        toast.success("Ürün sepete eklendi");
    };

    return (
        <Link href={`/products/${product.slug}`} className="group block h-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col relative">
                {/* Image */}
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <span className="text-4xl">📦</span>
                        </div>
                    )}

                    {/* Quick Action Overlay - Visible on Hover (or always on touch devices via media query if needed, but standard hover logic works for desktop) */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center bg-gradient-to-t from-black/50 to-transparent">
                        {!hasVariants && product.stock > 0 ? (
                            <Button
                                size="sm"
                                className="w-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white border-none"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Sepete Ekle
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-full shadow-lg"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                İncele
                            </Button>
                        )}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {badge && (
                            <Badge className="bg-blue-600">{badge}</Badge>
                        )}
                        {product.stock === 0 && (
                            <Badge variant="destructive">Stokta Yok</Badge>
                        )}
                    </div>

                    {/* Discount Badge */}
                    {discountRate > 0 && (
                        <Badge className="absolute top-2 right-2 bg-green-600">
                            %{discountRate} İndirim
                        </Badge>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                    {product.category && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {product.category.name}
                        </p>
                    )}
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors flex-1">
                        {product.name}
                    </h3>

                    {/* Pricing */}
                    <div className="space-y-1 mt-auto pt-2">
                        {isDealer ? (
                            <>
                                {discountRate > 0 && (
                                    <p className="text-sm text-gray-400 line-through">
                                        {formatPrice(price.listPrice)}
                                    </p>
                                )}
                                <p className="text-lg font-bold text-blue-600">
                                    {formatPrice(price.finalPrice)}
                                    <span className="text-xs font-normal text-gray-500 ml-1">
                                        (KDV Dahil)
                                    </span>
                                </p>
                            </>
                        ) : (
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {formatPrice(product.listPrice * (1 + product.vatRate / 100))}
                                <span className="text-xs font-normal text-gray-500 ml-1">
                                    (KDV Dahil)
                                </span>
                            </p>
                        )}
                    </div>

                    {/* Min Quantity Info */}
                    {product.minQuantity > 1 && (
                        <p className="text-xs text-amber-600 mt-2">
                            Min. sipariş: {product.minQuantity} adet
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
