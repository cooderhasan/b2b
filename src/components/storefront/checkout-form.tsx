"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice, SHIPPING_FREE_LIMIT } from "@/lib/helpers";
import { createOrder } from "@/app/(storefront)/checkout/actions";
import { toast } from "sonner";
import { CreditCard, Building2, ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CheckoutFormProps {
    initialData?: {
        name?: string;
        phone?: string;
        city?: string;
        district?: string;
        address?: string;
    };
    cargoCompanies: { id: string; name: string }[];
}

export function CheckoutForm({ initialData, cargoCompanies }: CheckoutFormProps) {
    const router = useRouter();
    const { items, getSummary, discountRate, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const orderCompleted = useRef(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Don't redirect if order was just completed
        if (mounted && items.length === 0 && !orderCompleted.current) {
            router.push("/cart");
        }
    }, [mounted, items.length, router]);

    if (!mounted) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-16">Yükleniyor...</div>
            </div>
        );
    }

    const summary = getSummary();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-16">Yönlendiriliyor...</div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await createOrder({
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: Number(item.quantity),
                    listPrice: Number(item.listPrice),
                    vatRate: Number(item.vatRate),
                    variantId: item.variantId || undefined,
                    variantInfo: item.variantInfo || undefined,
                })),
                shippingAddress: {
                    name: String(formData.get("name")),
                    address: String(formData.get("address")),
                    city: String(formData.get("city")),
                    district: formData.get("district") ? String(formData.get("district")) : undefined,
                    phone: String(formData.get("phone")),
                },
                cargoCompany: String(formData.get("cargoCompany")),
                notes: formData.get("notes") ? String(formData.get("notes")) : undefined,
                discountRate: Number(discountRate),
            });

            if (result.success) {
                // Mark order as completed to prevent empty cart redirect
                orderCompleted.current = true;
                toast.success("Siparişiniz başarıyla oluşturuldu!");
                clearCart();
                router.push(`/orders/${result.orderId}`);
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            console.error("Checkout handleSubmit error:", error);
            toast.error("Bir hata oluştu. Lütfen konsolu kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link
                href="/cart"
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Sepete Dön
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Sipariş Tamamla
            </h1>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Shipping Address */}
                        <Card className="border-l-4 border-l-blue-600">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-blue-600" />
                                    Teslimat ve Kargo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Ad Soyad / Firma *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            defaultValue={initialData?.name}
                                            placeholder="Adınız veya Firma Adı"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefon *</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            defaultValue={initialData?.phone}
                                            placeholder="05XX XXX XX XX"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Şehir *</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            required
                                            defaultValue={initialData?.city}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="district">İlçe</Label>
                                        <Input
                                            id="district"
                                            name="district"
                                            defaultValue={initialData?.district}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Adres *</Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        rows={2}
                                        required
                                        defaultValue={initialData?.address}
                                        placeholder="Tam adresiniz..."
                                    />
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="cargoCompany">Kargo Firması Seçimi *</Label>
                                    <Select name="cargoCompany" required>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Kargo firması seçiniz" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cargoCompanies.map((company) => (
                                                <SelectItem key={company.id} value={company.name}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500">
                                        Siparişiniz seçtiğiniz kargo firması ile gönderilecektir.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Ödeme Yöntemi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 cursor-pointer ring-2 ring-blue-500 ring-offset-2">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            Havale / EFT
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Sipariş sonunda banka bilgileri verilecektir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 border rounded-lg opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800">
                                    <CreditCard className="h-6 w-6 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-500">Kredi Kartı</p>
                                        <p className="text-sm text-gray-400">Çok yakında hizmetinizde</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Sipariş Notu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    name="notes"
                                    placeholder="Siparişinizle ilgili belirtmek istediğiniz özel bir durum var mı?"
                                    rows={2}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-4">
                        <Card className="sticky top-24 shadow-lg border-t-4 border-t-gray-800 dark:border-t-gray-200">
                            <CardHeader className="pb-4">
                                <CardTitle>Sipariş Özeti</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                    {items.map((item) => (
                                        <div
                                            key={item.variantId ? `${item.productId}-${item.variantId}` : item.productId}
                                            className="flex justify-between text-sm group"
                                        >
                                            <div className="flex-1 pr-2">
                                                <div className="font-medium text-gray-900 dark:text-gray-100 flex items-start gap-2">
                                                    <span className="bg-gray-100 dark:bg-gray-800 text-xs px-1.5 py-0.5 rounded min-w-[20px] text-center">
                                                        {item.quantity}x
                                                    </span>
                                                    <span className="truncate block line-clamp-2">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                {item.variantInfo && (
                                                    <p className="text-xs text-gray-500 pl-7 mt-0.5">{item.variantInfo}</p>
                                                )}
                                            </div>
                                            <div className="font-medium whitespace-nowrap">
                                                {formatPrice(
                                                    item.listPrice *
                                                    item.quantity *
                                                    (1 - discountRate / 100) *
                                                    (1 + item.vatRate / 100)
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Ara Toplam</span>
                                        <span>{formatPrice(summary.subtotal)}</span>
                                    </div>
                                    {summary.discountAmount > 0 && (
                                        <div className="flex justify-between text-green-600 font-medium">
                                            <span>İskonto (%{discountRate})</span>
                                            <span>-{formatPrice(summary.discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>KDV Toplam</span>
                                        <span>{formatPrice(summary.vatAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Kargo</span>
                                        <span className={`font-medium ${summary.total >= SHIPPING_FREE_LIMIT ? "text-green-600" : "text-gray-900 dark:text-gray-200"}`}>
                                            {summary.total >= SHIPPING_FREE_LIMIT ? "Ücretsiz" : "Alıcı Öder"}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-lg">Toplam Tutar</span>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {formatPrice(summary.total)}
                                        </div>
                                        {summary.total < SHIPPING_FREE_LIMIT && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                +{formatPrice(SHIPPING_FREE_LIMIT - summary.total)} daha ekle, kargo bedava olsun!
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        "Sipariş Oluşturuluyor..."
                                    ) : (
                                        <>
                                            Siparişi Onayla
                                            <span className="ml-2 font-normal text-blue-100/80">
                                                • {formatPrice(summary.total)}
                                            </span>
                                        </>
                                    )}
                                </Button>

                                <div className="text-[10px] text-center text-gray-400 leading-tight">
                                    <p>Siparişi onaylayarak <Link href="/policies/distance-sales" className="underline hover:text-gray-600">Mesafeli Satış Sözleşmesi</Link>'ni</p>
                                    <p>kabul etmiş olursunuz.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
