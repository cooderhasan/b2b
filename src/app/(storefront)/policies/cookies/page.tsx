export default function CookiesPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                Çerez Politikası
            </h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    Çerez Nedir?
                </h3>
                <p>
                    Çerezler (cookies), bir internet sitesini ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarÄ±dır. Bu dosyalar, site tercihlerinizin hatırlanması, oturumunuzun açık tutulması ve size özel içerik sunulması gibi amaçlarla kullanılır.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    Kullandığımız Çerez Türleri
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Zorunlu Çerezler:</strong> Sitenin düzgün çalışması için gereklidir (örn. sepet işlemleri).</li>
                    <li><strong>Analitik Çerezler:</strong> Ziyaretçi davranışlarını analiz ederek sitemizi geliştirmemize yardımcı olur.</li>
                    <li><strong>Pazarlama Çerezleri:</strong> İlgi alanlarınıza göre size uygun reklamlar göstermek için kullanılır.</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    Çerez Yönetimi
                </h3>
                <p>
                    Tarayıcı ayarlarınızı değiştirerek çerezleri dilediğiniz zaman engelleyebilir veya silebilirsiniz. Ancak, zorunlu çerezlerin engellenmesi durumunda sitemizin bazı özellikleri çalışmayabilir.
                </p>
            </div>
        </div>
    );
}
