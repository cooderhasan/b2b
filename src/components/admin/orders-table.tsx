"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Eye, FileDown, Search, X } from "lucide-react";
import {
    formatDate,
    getOrderStatusLabel,
    getOrderStatusColor,
    formatPrice,
} from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus, updateOrderTracking } from "@/app/admin/(protected)/orders/actions";
import { toast } from "sonner";
import { OrderWithItems } from "@/types";
import { Label } from "@/components/ui/label";

interface OrdersTableProps {
    orders: OrderWithItems[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
    };
}

const orderStatuses = [
    { value: "ALL", label: "Tümü" },
    { value: "PENDING", label: "Ödeme Bekleniyor" },
    { value: "CONFIRMED", label: "Onaylandı" },
    { value: "PROCESSING", label: "Hazırlanıyor" },
    { value: "SHIPPED", label: "Kargolandı" },
    { value: "DELIVERED", label: "Tamamlandı" },
    { value: "CANCELLED", label: "İptal Edildi" },
];

export function OrdersTable({ orders: initialOrders, pagination }: OrdersTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filter States
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
    const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // Sync local order state when props change (due to server refetch)
    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    // Handle Search/Filter Application
    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (searchTerm) params.set("search", searchTerm);
        else params.delete("search");

        if (statusFilter && statusFilter !== "ALL") params.set("status", statusFilter);
        else params.delete("status");

        if (startDate) params.set("startDate", startDate);
        else params.delete("startDate");

        if (endDate) params.set("endDate", endDate);
        else params.delete("endDate");

        // Reset to page 1 on filter change
        params.set("page", "1");

        router.push(`?${params.toString()}`);
    };

    // Handle Reset
    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("ALL");
        setStartDate("");
        setEndDate("");
        router.push("/admin/orders");
    };

    // Handle Pagination
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setLoadingId(orderId);
        try {
            const result = await updateOrderStatus(orderId, newStatus as any);
            if (result && result.success) {
                setOrders((prev) =>
                    prev.map((order) =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                toast.success("Sipariş durumu güncellendi");
            } else {
                toast.error("Güncelleme başarısız oldu");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px] space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Arama</label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Sipariş No, Müşteri Adı..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="w-full md:w-[180px] space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Durum</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tümü" />
                            </SelectTrigger>
                            <SelectContent>
                                {orderStatuses.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="space-y-2 flex-1 md:w-[140px]">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Başlangıç</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="pt-8 text-gray-400">-</div>
                        <div className="space-y-2 flex-1 md:w-[140px]">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bitiş</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-end gap-2 md:ml-auto w-full md:w-auto pt-2 md:pt-0">
                        <Button onClick={resetFilters} variant="ghost" className="text-gray-500 hover:text-gray-700">
                            Temizle
                        </Button>
                        <Button onClick={applyFilters} className="min-w-[100px]">
                            Filtrele
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sipariş No</TableHead>
                                <TableHead>Müşteri</TableHead>
                                <TableHead>Tarih</TableHead>
                                <TableHead>Tutar</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        Sipariş bulunamadı.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setIsOpen(true);
                                        }}
                                    >
                                        <TableCell className="font-medium">
                                            #{order.orderNumber}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {order.user.companyName || order.user.email}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {order.user.phone || "-"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                        <TableCell className="font-medium">
                                            {formatPrice(Number(order.total))}
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <div className="w-[180px]">
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(value) => handleStatusChange(order.id, value)}
                                                    disabled={loadingId === order.id}
                                                >
                                                    <SelectTrigger className={`h-8 border-transparent bg-transparent hover:bg-white/50 focus:ring-0 ${getOrderStatusColor(order.status)} border`}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {orderStatuses.filter(s => s.value !== 'ALL').map((status) => (
                                                            <SelectItem key={status.value} value={status.value}>
                                                                {status.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Yazdır"
                                                    onClick={() => window.open(`/admin/orders/${order.id}/print`, '_blank')}
                                                >
                                                    <span className="text-lg">🖨️</span>
                                                </Button>
                                                <a
                                                    href={`/admin/orders/${order.id}/pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                                                    title="PDF Olarak İndir"
                                                >
                                                    <FileDown className="h-5 w-5" />
                                                </a>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Double check
                                                        setSelectedOrder(order);
                                                        setIsOpen(true);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t">
                        <div className="text-sm text-gray-500">
                            Toplam {pagination.totalCount} sipariş, Sayfa {pagination.currentPage} / {pagination.totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage <= 1}
                            >
                                Önceki
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage >= pagination.totalPages}
                            >
                                Sonraki
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Sipariş Detayı - {selectedOrder?.orderNumber}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Müşteri Bilgileri</h4>
                                    <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                                        <p>
                                            <span className="font-medium">Firma/Ad:</span>{" "}
                                            {selectedOrder.user.companyName ||
                                                selectedOrder.user.email}
                                        </p>
                                        <p>
                                            <span className="font-medium">Email:</span>{" "}
                                            {selectedOrder.user.email}
                                        </p>
                                        <p>
                                            <span className="font-medium">Telefon:</span>{" "}
                                            {selectedOrder.user.phone || "-"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Sipariş Notu</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                                        {selectedOrder.notes || "Not yok."}
                                    </p>
                                </div>
                            </div>

                            {/* Shipping Address & Tracking */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Teslimat Adresi</h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800 rounded-md h-full">
                                        {selectedOrder.shippingAddress ? (
                                            <>
                                                <p className="font-bold">{(selectedOrder.shippingAddress as any).title}</p>
                                                <p>{(selectedOrder.shippingAddress as any).address}</p>
                                                <p>{(selectedOrder.shippingAddress as any).district} / {(selectedOrder.shippingAddress as any).city}</p>
                                                <p>Tel: {(selectedOrder.shippingAddress as any).phone}</p>
                                            </>
                                        ) : (
                                            <p>Adres bilgisi bulunamadı.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Kargo Bilgileri</h4>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                            <p><span className="font-medium">Firma:</span> {selectedOrder.cargoCompany || "Seçilmedi"}</p>
                                            <div className="mt-2">
                                                <Label className="text-xs font-medium mb-1 block">Takip Linki</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        defaultValue={selectedOrder.trackingUrl || ""}
                                                        placeholder="https://kargo-takip..."
                                                        className="h-8 text-xs"
                                                        id={`tracking-${selectedOrder.id}`}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        className="h-8 px-2"
                                                        onClick={async () => {
                                                            const input = document.getElementById(`tracking-${selectedOrder.id}`) as HTMLInputElement;
                                                            if (!input) return;

                                                            const result = await updateOrderTracking(selectedOrder.id, input.value);
                                                            if (result.success) {
                                                                toast.success("Takip linki güncellendi");
                                                                // Update local state to reflect change immediately
                                                                setSelectedOrder(prev => prev ? ({ ...prev, trackingUrl: input.value }) : null);
                                                                setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, trackingUrl: input.value } : o));
                                                            } else {
                                                                toast.error(result.error);
                                                            }
                                                        }}
                                                    >
                                                        Kaydet
                                                    </Button>
                                                </div>
                                                {selectedOrder.trackingUrl && (
                                                    <a href={selectedOrder.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                                                        Linki Aç ↗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Order Items */}
                            <div>
                                <h4 className="font-semibold mb-2">Ürünler</h4>
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Ürün</TableHead>
                                                <TableHead className="text-center">Adet</TableHead>
                                                <TableHead className="text-right">Birim Fiyat</TableHead>
                                                <TableHead className="text-right">Toplam</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedOrder.items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell className="text-center">
                                                        {item.quantity}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatPrice(Number(item.unitPrice))}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {formatPrice(Number(item.lineTotal))}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Ara Toplam</span>
                                        <span>{formatPrice(Number(selectedOrder.subtotal))}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>KDV Toplam</span>
                                        <span>{formatPrice(Number(selectedOrder.vatAmount))}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Genel Toplam</span>
                                        <span>{formatPrice(Number(selectedOrder.total))}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
