"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { registerUser } from "./actions";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            await registerUser(formData);
            setSuccess(true);
            toast.success("Kayıt başarılı!");
            // No redirect, show success state instead
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
                <Card className="w-full max-w-lg shadow-xl border-green-200 bg-white/95 backdrop-blur">
                    <CardHeader className="text-center pb-2">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <CardTitle className="text-2xl text-green-700">Üyelik Başarıyla Oluşturuldu</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6 pt-4">
                        <div className="space-y-2 text-gray-600 dark:text-gray-300">
                            <p className="text-lg font-medium">
                                Bayilik başvurunuz alınmıştır.
                            </p>
                            <p>
                                Bayiliğiniz yönetici tarafından onaylandıktan sonra<br />
                                sisteme giriş yapıp sipariş verebilirsiniz.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Link href="/login">
                                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                                    Giriş Yap
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">B2B</span>
                    </div>
                    <CardTitle className="text-2xl">Bayi Kaydı</CardTitle>
                    <CardDescription>
                        Bayi olmak için formu doldurun, hesabınız onaylandıktan sonra alışverişe başlayabilirsiniz.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-posta *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password">Şifre *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    minLength={6}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Şifre Tekrar *</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    minLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyName">Firma Adı *</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="taxNumber">Vergi Numarası *</Label>
                                <Input
                                    id="taxNumber"
                                    name="taxNumber"
                                    minLength={10}
                                    maxLength={11}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Şehir *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    required
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
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Zaten hesabınız var mı? </span>
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Giriş Yap
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
