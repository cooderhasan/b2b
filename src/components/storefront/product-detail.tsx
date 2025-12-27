"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductCard } from "./product-card";
import { formatPrice, calculatePrice, validateMinQuantity } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { useState } from "react";
import { ShoppingCart, Minus, Plus, Package, Truck, ArrowLeft } from "lucide-react";

interface ProductVariant {
    id: string;
    color: string | null;
    size: string | null;
    stock: number;
    sku: string | null;
    barcode: string | null;
    priceAdjustment: number;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    images: string[];
    listPrice: number;
    vatRate: number;
    minQuantity: number;
    stock: number;
    sku: string | null;
    barcode: string | null;
    origin: string | null;
    description: string | null;
    category: {
        id: string;
        name: string;
        slug: string;
    } | null;
    variants?: ProductVariant[];
}

interface ProductDetailProps {
    product: Product;
    relatedProducts: Product[];
    discountRate: number;
    isDealer: boolean;
    isAuthenticated: boolean;
}

export function ProductDetail({
    product,
    relatedProducts,
    discountRate,
    isDealer,
    isAuthenticated,
}: ProductDetailProps) {
    const [quantity, setQuantity] = useState(product.minQuantity);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const addItem = useCartStore((state) => state.addItem);

    // Get unique colors and sizes from variants
    const variants = product.variants || [];
    const colors = [...new Set(variants.filter(v => v.color).map(v => v.color!))];
    const sizes = [...new Set(variants.filter(v => v.size).map(v => v.size!))];
    const hasVariants = variants.length > 0;

    // Selected color and size
    const [selectedColor, setSelectedColor] = useState<string | null>(colors.length > 0 ? colors[0] : null);
    const [selectedSize, setSelectedSize] = useState<string | null>(sizes.length > 0 ? sizes[0] : null);

    // Find matching variant based on selection
    const findVariant = () => {
        if (!hasVariants) return null;
        return variants.find(v => {
            const colorMatch = !colors.length || v.color === selectedColor;
            const sizeMatch = !sizes.length || v.size === selectedSize;
            return colorMatch && sizeMatch;
        }) || null;
    };

    // Update selected variant when color/size changes
    const currentVariant = findVariant();
    const effectiveStock = hasVariants ? (currentVariant?.stock || 0) : product.stock;
    const priceAdjustment = currentVariant?.priceAdjustment || 0;

    const price = calculatePrice(
        product.listPrice + priceAdjustment,
        discountRate,
        product.vatRate
    );

    const handleQuantityChange = (value: number) => {
        if (value >= product.minQuantity && value <= effectiveStock) {
            setQuantity(value);
        }
    };

    const handleAddToCart = () => {
        const validation = validateMinQuantity(quantity, product.minQuantity);
        if (!validation.valid) {
            toast.error(validation.message);
            return;
        }

        if (quantity > effectiveStock) {
            toast.error(`Stokta sadece ${effectiveStock} adet bulunuyor.`);
            return;
        }

        if (hasVariants && !currentVariant) {
            toast.error("Lütfen bir varyant seçin.");
            return;
        }

        // Build variant info string
        const variantInfo = currentVariant ?
            [selectedColor && `Renk: ${selectedColor}`, selectedSize && `Beden: ${selectedSize}`]
                .filter(Boolean).join(", ") : undefined;

        addItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0] || "",
            quantity,
            listPrice: product.listPrice + priceAdjustment,
            discountRate,
            vatRate: product.vatRate,
            minQuantity: product.minQuantity,
            stock: effectiveStock,
            variantId: currentVariant?.id,
            variantInfo,
        });

        toast.success("Ürün sepete eklendi!");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:text-blue-600">
                    Ana Sayfa
                </Link>
                <span>/</span>
                <Link href="/products" className="hover:text-blue-600">
                    Ürünler
                </Link>
                {product.category && (
                    <>
                        <span>/</span>
                        <Link
                            href={`/products?category=${product.category.slug}`}
                            className="hover:text-blue-600"
                        >
                            {product.category.name}
                        </Link>
                    </>
                )}
                <span>/</span>
                <span className="text-gray-900 dark:text-white">{product.name}</span>
            </div>

            {/* Product Info */}
            <div className="grid gap-8 lg:grid-cols-2 mb-16">
                {/* Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                        {product.images[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Package className="w-24 h-24 text-gray-300" />
                            </div>
                        )}
                        {product.stock === 0 && (
                            <Badge variant="destructive" className="absolute top-4 left-4">
                                Stokta Yok
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                    {product.category && (
                        <Badge variant="secondary">{product.category.name}</Badge>
                    )}

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {product.name}
                    </h1>

                    {product.description && (
                        <p className="text-gray-600 dark:text-gray-300">
                            {product.description}
                        </p>
                    )}

                    {/* Variant Selection */}
                    {hasVariants && (
                        <div className="space-y-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            {colors.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Renk:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                className={cn(
                                                    "relative flex flex-col items-center justify-between overflow-hidden rounded-md border-2 p-1 transition-all hover:border-black dark:hover:border-white focus:outline-hidden w-24 h-28",
                                                    selectedColor === color
                                                        ? "border-black dark:border-white opacity-100"
                                                        : "border-transparent bg-white dark:bg-gray-700 opacity-80"
                                                )}
                                            >
                                                <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-600 rounded-sm overflow-hidden mb-2">
                                                    {product.images[0] ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={color}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium leading-none text-center block w-full truncate px-1">
                                                    {color}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {sizes.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Beden:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size) => (
                                            <Button
                                                key={size}
                                                type="button"
                                                variant={selectedSize === size ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {currentVariant ? (
                                currentVariant.stock > 0 ? (
                                    <p className="text-sm text-green-600">
                                        Seçili varyant stokta: {currentVariant.stock} adet
                                    </p>
                                ) : (
                                    <p className="text-sm text-red-600 font-medium">
                                        Bu seçenek tükendi (Stokta yok)
                                    </p>
                                )
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Bu kombinasyon mevcut değil
                                </p>
                            )}
                        </div>
                    )}

                    {/* Pricing */}
                    <div className="space-y-2">
                        {isDealer ? (
                            <>
                                {discountRate > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg text-gray-400 line-through">
                                            {formatPrice(
                                                product.listPrice * (1 + product.vatRate / 100)
                                            )}
                                        </span>
                                        <Badge className="bg-green-600">%{discountRate} İndirim</Badge>
                                    </div>
                                )}
                                <div className="text-4xl font-bold text-blue-600">
                                    {formatPrice(price.finalPrice)}
                                </div>
                                <p className="text-sm text-gray-500">
                                    KDV Dahil ({product.vatRate}% KDV: {formatPrice(price.vatAmount)})
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(
                                        product.listPrice * (1 + product.vatRate / 100)
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    KDV Dahil (%{product.vatRate})
                                </p>
                                {!isAuthenticated && (
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg mt-4">
                                        <p className="text-amber-800 dark:text-amber-200 text-sm">
                                            <strong>Bayi olun, özel fiyatlardan yararlanın!</strong>
                                            <br />
                                            Bayilerimize %20&apos;ye varan indirimler sunuyoruz.
                                        </p>
                                        <Link href="/register" className="underline hover:text-amber-900 border-none p-0 inline">
                                            Hemen başvurun.
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Product Details (SKU, Barcode, Origin) */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3 text-sm border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                            <span className="text-gray-500 dark:text-gray-400">Stok Kodu</span>
                            <span className="font-medium text-gray-900 dark:text-white font-mono">
                                {currentVariant?.sku || product.sku || "-"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                            <span className="text-gray-500 dark:text-gray-400">Barkod</span>
                            <span className="font-medium text-gray-900 dark:text-white font-mono">
                                {currentVariant?.barcode || product.barcode || "-"}
                            </span>
                        </div>
                        {product.origin ? (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Menşei</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {product.origin}
                                </span>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Menşei</span>
                                <span className="font-medium text-gray-900 dark:text-white">-</span>
                            </div>
                        )}
                    </div>

                    {/* Stock & Min Quantity */}
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span>Stok: {product.stock} adet</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-gray-400" />
                            <span>Min. sipariş: {product.minQuantity} adet</span>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    {isDealer && product.stock > 0 && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">Adet:</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= product.minQuantity}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                        className="w-20 text-center"
                                        min={product.minQuantity}
                                        max={product.stock}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-lg font-bold">
                                    Toplam: {formatPrice(price.finalPrice * quantity)}
                                </div>
                            </div>

                            <Button size="lg" className="w-full" onClick={handleAddToCart}>
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Sepete Ekle
                            </Button>
                        </div>
                    )}

                    {!isDealer && (
                        <div className="pt-4 border-t">
                            {isAuthenticated ? (
                                <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
                                    <p className="font-medium">Bayi Gerekli</p>
                                    <p className="text-sm mt-1">Sipariş vermek için onaylanmış bayi hesabınızın olması gerekmektedir.</p>
                                </div>
                            ) : (
                                <Link href="/login">
                                    <Button size="lg" className="w-full">
                                        Sipariş vermek için giriş yapın
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="border-t pt-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                        Benzer Ürünler
                    </h2>
                    <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
                        {relatedProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                discountRate={discountRate}
                                isDealer={isDealer}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
