export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                Gizlilik Sözleşmesi
            </h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                <p>
                    [Şirket Adı] (&quot;Şirket&quot;), müşterilerinin gizliliğini korumak amacıyla aşağıdaki gizlilik ilkelerini benimsemiştir.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    Gizlilik Politikası Kapsamı
                </h3>
                <p>
                    Bu gizlilik politikası, sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda toplanan bilgilerin nasıl kullanıldığını, korunduğunu ve paylaşıldığını açıklar.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    Veri Güvenliği
                </h3>
                <p>
                    Şirketimiz, kişisel verilerinizin güvenliğini sağlamak için gerekli teknik ve idari tedbirleri almaktadır. Verileriniz güvenli sunucularda saklanmakta ve yetkisiz erişimlere karşı korunmaktadır.
                </p>

                {/* Placeholder Warning */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mt-8">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        * Bu metin taslak niteliğindedir. Hukuki geçerlilik için avukatınıza danışınız.
                    </p>
                </div>
            </div>
        </div>
    );
}
