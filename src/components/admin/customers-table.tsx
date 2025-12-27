"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Eye, UserCheck } from "lucide-react";
import { getUserStatusLabel, getUserStatusColor, formatDate } from "@/lib/helpers";
import { toast } from "sonner";
import { updateCustomerStatus, updateCustomerDiscountGroup } from "@/app/admin/(protected)/customers/actions";

interface Customer {
    id: string;
    email: string;
    companyName: string | null;
    taxNumber: string | null;
    phone: string | null;
    city: string | null;
    role: string;
    status: string;
    createdAt: Date;
    discountGroup: {
        id: string;
        name: string;
        discountRate: number | { toNumber(): number };
    } | null;
    _count: {
        orders: number;
    };
}

interface DiscountGroup {
    id: string;
    name: string;
    discountRate: number | { toNumber(): number };
}

interface CustomersTableProps {
    customers: Customer[];
    discountGroups: DiscountGroup[];
}

export function CustomersTable({
    customers,
    discountGroups,
}: CustomersTableProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleApprove = async (customerId: string) => {
        setLoading(true);
        try {
            await updateCustomerStatus(customerId, "APPROVED", "DEALER");
            toast.success("Müşteri onaylandı ve bayi olarak atandı.");
        } catch {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (customerId: string) => {
        setLoading(true);
        try {
            await updateCustomerStatus(customerId, "REJECTED");
            toast.success("Müşteri başvurusu reddedildi.");
        } catch {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleDiscountGroupChange = async (
        customerId: string,
        discountGroupId: string
    ) => {
        try {
            await updateCustomerDiscountGroup(customerId, discountGroupId);
            toast.success("İskonto grubu güncellendi.");
        } catch {
            toast.error("Bir hata oluştu.");
        }
    };

    return (
        <>
            <div className="rounded-lg border bg-white dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Firma</TableHead>
                            <TableHead>E-posta</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>İskonto Grubu</TableHead>
                            <TableHead>Sipariş</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    Henüz müşteri bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">
                                                {customer.companyName || "-"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                VKN: {customer.taxNumber || "-"}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone || "-"}</TableCell>
                                    <TableCell>
                                        <Badge className={getUserStatusColor(customer.status)}>
                                            {getUserStatusLabel(customer.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {customer.status === "APPROVED" ? (
                                            <Select
                                                value={customer.discountGroup?.id || ""}
                                                onValueChange={(value) =>
                                                    handleDiscountGroupChange(customer.id, value)
                                                }
                                            >
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Grup Seçin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {discountGroups.map((group) => (
                                                        <SelectItem key={group.id} value={group.id}>
                                                            {group.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{customer._count.orders}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {customer.status === "PENDING" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 hover:text-green-700"
                                                        onClick={() => handleApprove(customer.id)}
                                                        disabled={loading}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Onayla
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => handleReject(customer.id)}
                                                        disabled={loading}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Reddet
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
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

            {/* Customer Detail Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Müşteri Detayı</DialogTitle>
                        <DialogDescription>
                            {selectedCustomer?.companyName || selectedCustomer?.email}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCustomer && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Firma Adı</p>
                                    <p className="font-medium">
                                        {selectedCustomer.companyName || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Vergi No</p>
                                    <p className="font-medium">
                                        {selectedCustomer.taxNumber || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">E-posta</p>
                                    <p className="font-medium">{selectedCustomer.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Telefon</p>
                                    <p className="font-medium">{selectedCustomer.phone || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Şehir</p>
                                    <p className="font-medium">{selectedCustomer.city || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Kayıt Tarihi</p>
                                    <p className="font-medium">
                                        {formatDate(selectedCustomer.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Durum</p>
                                    <Badge className={getUserStatusColor(selectedCustomer.status)}>
                                        {getUserStatusLabel(selectedCustomer.status)}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Toplam Sipariş</p>
                                    <p className="font-medium">{selectedCustomer._count.orders}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Kapat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
