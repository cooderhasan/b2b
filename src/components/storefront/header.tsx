"use client";

import { useState, useRef, useEffect } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, Menu, LogOut, Package, Settings, LayoutDashboard } from "lucide-react";
import { signOut } from "next-auth/react";
import { useCartStore } from "@/stores/cart-store";
import type { UserRole, UserStatus } from "@prisma/client";
import { SearchInput } from "./search-input";

interface StorefrontHeaderProps {
    user?: {
        id: string;
        email: string;
        role: UserRole;
        status: UserStatus;
        companyName?: string | null;
        discountRate?: number;
    } | null;
    logoUrl?: string;
    siteName?: string;
}

export function StorefrontHeader({ user, logoUrl, siteName }: StorefrontHeaderProps) {
    const items = useCartStore((state) => state.items);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 300); // 300ms delay to allow moving to the dropdown
    };

    const isAdmin = user?.role === "ADMIN" || user?.role === "OPERATOR";
    const isDealer = user?.role === "DEALER" && user?.status === "APPROVED";

    // Defensive check: Ensure discountRate isn't accessed if it's somehow a Decimal object
    // mostly irrelevant since auth() converts it, but good for safety
    const safeDiscountRate = typeof user?.discountRate === 'number' ? user.discountRate : 0;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur dark:bg-gray-900/95 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        {logoUrl ? (
                            <img src={logoUrl} alt={siteName || "Logo"} className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold">B2B</span>
                                </div>
                                <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:inline">
                                    {siteName || "Toptancı"}
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/products"
                            className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300"
                        >
                            Ürünler
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300"
                        >
                            Hakkımızda
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300"
                        >
                            İletişim
                        </Link>
                    </nav>


                    {/* Search */}
                    <div className="flex-1 max-w-md mx-4 hidden md:block">
                        <SearchInput />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">

                        {/* User Panel */}
                        {/* User Panel */}
                        <div
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="relative py-4"
                        >
                            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen} modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 group outline-none">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-xs text-gray-500 font-medium">Kullanıcı</span>
                                            <span className={`text-sm font-bold ${user ? 'text-blue-600' : 'text-gray-800'} group-hover:text-blue-600 transition-colors`}>
                                                Paneli
                                            </span>
                                        </div>
                                        <svg
                                            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                            className="ml-1 text-gray-400 group-hover:text-blue-600"
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>
                                </DropdownMenuTrigger>

                                {/* Dropdown Content */}
                                {!user ? (
                                    /* GUEST VIEW */
                                    <DropdownMenuContent align="end" className="w-[300px] p-4">
                                        <div className="flex flex-col gap-3">
                                            <Link href="/login" className="w-full">
                                                <Button variant="secondary" className="w-full py-6 text-base font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700">
                                                    BAYİ GİRİŞİ
                                                </Button>
                                            </Link>

                                            <Link href="/register" className="w-full">
                                                <Button variant="secondary" className="w-full py-6 text-base font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700">
                                                    BAYİ OL
                                                </Button>
                                            </Link>

                                            {/* Social Login Placeholders (Disabled/Hidden per request) */}
                                            {/* <Button className="w-full bg-[#1877F2] hover:bg-[#1864cc]">Facebook ile bağlan</Button> */}
                                        </div>
                                    </DropdownMenuContent>
                                ) : (
                                    /* LOGGED IN VIEW */
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium">
                                                    {user.companyName || "Hoşgeldiniz"}
                                                </p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/account">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                Hesabım
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {isDealer && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/account/orders">
                                                        <Package className="mr-2 h-4 w-4" />
                                                        Siparişlerim
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        {isAdmin && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin">
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        Admin Panel
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Çıkış Yap
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                )}
                            </DropdownMenu>
                        </div>

                        {/* Cart */}
                        <Link href="/cart" className="flex items-center gap-4 pl-6 border-l group h-10">
                            <div className="relative">
                                <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-blue-600 dark:text-gray-300 transition-colors" />
                                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                                    {itemCount}
                                </span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-500 font-medium group-hover:text-blue-600 transition-colors">Sepetim</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    {/* Calculate Total in Header or fetch summary? Ideally passed or context. 
                                        Since we use zustand 'useCartStore', we can get summary here.
                                    */}
                                    {/* We need to use formatPrice(summary.total) but summary calculation is needed. */}
                                    {/* Let's refactor component body slightly to get summary */}
                                    <CartTotalDisplay />
                                </span>
                            </div>
                        </Link>

                        {/* Mobile Menu Trigger */}
                        <Button variant="ghost" size="icon" className="md:hidden ml-2">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header >
    );
}

function CartTotalDisplay() {
    const getSummary = useCartStore((state) => state.getSummary);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const summary = getSummary();
    const formattedTotal = new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(summary.total);

    // Server renders 0, Client waits for mount to render actual total
    if (!mounted) {
        return (
            <>
                {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(0)}
            </>
        );
    }

    return <>{formattedTotal}</>;
}
