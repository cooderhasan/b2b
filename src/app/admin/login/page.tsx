"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticateAdmin } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Giriş Yapılıyor...
                </>
            ) : (
                "Yönetici Girişi"
            )}
        </Button>
    );
}

export default function AdminLoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticateAdmin, undefined);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-white">
                        B2B Yönetim Paneli
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sadece yetkili personel girişi içindir.
                    </p>
                </div>

                <form action={dispatch} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-gray-300">Email Adresi</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-gray-300">Şifre</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••"
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <Alert variant="destructive" className="bg-red-900/50 border-red-900 text-red-200">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Hata</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}
