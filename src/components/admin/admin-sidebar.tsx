"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Settings,
    Tag,
    Image,
    FileText,
    ChevronLeft,
    Menu,
    Award,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Müşteriler",
        href: "/admin/customers",
        icon: Users,
    },
    {
        title: "Ürünler",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Kategoriler",
        href: "/admin/categories",
        icon: Tag,
    },
    {
        title: "Markalar",
        href: "/admin/brands",
        icon: Award,
    },
    {
        title: "Siparişler",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        title: "Slider",
        href: "/admin/sliders",
        icon: Image,
    },
    {
        title: "İskonto Grupları",
        href: "/admin/discount-groups",
        icon: FileText,
    },
    {
        title: "Ayarlar",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Mobile overlay */}
            <div className="lg:hidden fixed inset-0 z-40 bg-gray-900/50 hidden" />

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
                    collapsed ? "w-16" : "w-64",
                    "hidden lg:flex"
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                    {!collapsed && (
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">B2B</span>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                Admin Panel
                            </span>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="ml-auto"
                    >
                        <ChevronLeft
                            className={cn(
                                "h-4 w-4 transition-transform",
                                collapsed && "rotate-180"
                            )}
                        />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {!collapsed && <span>{item.title}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        href="/"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        )}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        {!collapsed && <span>Siteye Dön</span>}
                    </Link>
                </div>
            </aside>

            {/* Mobile menu button */}
            <Button
                variant="outline"
                size="icon"
                className="lg:hidden fixed top-4 left-4 z-50"
            >
                <Menu className="h-5 w-5" />
            </Button>
        </>
    );
}
