import Link from "next/link";

interface StorefrontFooterProps {
    settings?: Record<string, string>;
}

export function StorefrontFooter({ settings }: StorefrontFooterProps) {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold">B2B</span>
                            </div>
                            <span className="font-bold text-xl text-white">{settings?.siteName || "Toptancı"}</span>
                        </div>
                        <p className="text-sm">
                            {settings?.seoDescription || "Bayilerimize özel fiyatlarla toptan satış platformu."}
                        </p>
                        <div className="flex gap-4 pt-2">
                            {/* Socials */}
                            {settings?.facebookUrl && (
                                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
                            )}
                            {settings?.instagramUrl && (
                                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                            )}
                            {settings?.twitterUrl && (
                                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
                            )}
                            {settings?.linkedinUrl && (
                                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Hızlı Bağlantılar</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products" className="hover:text-white">
                                    Ürünler
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white">
                                    Hakkımızda
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white">
                                    İletişim
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/payment-methods" className="hover:text-white">
                                    Ödeme Şekilleri
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Corporate & Policies */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Kurumsal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/policies/kvkk" className="hover:text-white">
                                    KVKK Metni
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/privacy" className="hover:text-white">
                                    Gizlilik Sözleşmesi
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/distance-sales" className="hover:text-white">
                                    Mesafeli Satış Sözleşmesi
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/cancellation" className="hover:text-white">
                                    İptal ve İade
                                </Link>
                            </li>
                            <li>
                                <Link href="/policies/cookies" className="hover:text-white">
                                    Çerez Politikası
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">İletişim</h4>
                        <ul className="space-y-2 text-sm">
                            {settings?.phone && <li>{settings.phone}</li>}
                            {settings?.email && <li>{settings.email}</li>}
                            {settings?.address && <li className="whitespace-pre-wrap">{settings.address}</li>}
                        </ul>


                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>© {new Date().getFullYear()} {settings?.companyName || "B2B Toptancı"}. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    );
}
