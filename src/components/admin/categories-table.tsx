"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCategory, updateCategory, deleteCategory, toggleCategoryStatus } from "@/app/admin/(protected)/categories/actions";

interface Category {
    id: string;
    name: string;
    slug: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    _count: {
        products: number;
    };
}

interface CategoriesTableProps {
    categories: Category[];
}

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

export function CategoriesTable({ categories }: CategoriesTableProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [order, setOrder] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editCategory) {
                await updateCategory(editCategory.id, { name, slug, order });
                toast.success("Kategori güncellendi.");
            } else {
                await createCategory({ name, slug, order });
                toast.success("Kategori oluşturuldu.");
            }
            setIsOpen(false);
            resetForm();
        } catch {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

        try {
            await deleteCategory(id);
            toast.success("Kategori silindi.");
        } catch {
            toast.error("Bir hata oluştu.");
        }
    };

    const handleToggleStatus = async (id: string, isActive: boolean) => {
        try {
            await toggleCategoryStatus(id, isActive);
            toast.success(isActive ? "Kategori aktifleştirildi." : "Kategori pasifleştirildi.");
        } catch {
            toast.error("Bir hata oluştu.");
        }
    };

    const resetForm = () => {
        setName("");
        setSlug("");
        setOrder(0);
        setEditCategory(null);
    };

    const openEditDialog = (category: Category) => {
        setEditCategory(category);
        setName(category.name);
        setSlug(category.slug);
        setOrder(category.order);
        setIsOpen(true);
    };

    const openNewDialog = () => {
        resetForm();
        setIsOpen(true);
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Yeni Kategori
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editCategory ? "Kategori Düzenle" : "Yeni Kategori"}
                            </DialogTitle>
                            <DialogDescription>
                                Kategori bilgilerini girin
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Kategori Adı</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (!editCategory) {
                                                setSlug(slugify(e.target.value));
                                            }
                                        }}
                                        placeholder="Örn: Temizlik Ürünleri"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <Input
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="temizlik-urunleri"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order">Sıralama</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                    İptal
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Kaydediliyor..." : "Kaydet"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-lg border bg-white dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sıra</TableHead>
                            <TableHead>Kategori Adı</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Ürün Sayısı</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Henüz kategori bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.order}</TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="text-gray-500">{category.slug}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {category._count.products} ürün
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={category.isActive}
                                            onCheckedChange={(checked) =>
                                                handleToggleStatus(category.id, checked)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openEditDialog(category)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(category.id)}
                                                disabled={category._count.products > 0}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
