export default function KVKKPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                KVKK Metni (Kişisel Verilerin Korunması)
            </h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                <p>
                    Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;Kanun&quot;) kapsamında veri sorumlusu sıfatıyla [Şirket Adı] tarafından hazırlanmıştır.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    1. Kişisel Verilerin İşlenme Amacı
                </h3>
                <p>
                    Kişisel verileriniz, şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması, şirketimiz tarafından sunulan ürün ve hizmetlerin sizlerin beğeni, kullanım alışkanlıkları ve ihtiyaçlarına göre özelleştirilerek sizlere önerilmesi amacıyla işlenmektedir.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    2. İşlenen Kişisel Veriler
                </h3>
                <p>
                    Kimlik bilgileri, iletişim bilgileri, müşteri işlem bilgileri, işlem güvenliği bilgileri, pazarlama bilgileri gibi kategorilerdeki verileriniz işlenmektedir.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    3. Kişisel Verilerin Aktarılması
                </h3>
                <p>
                    Kişisel verileriniz, Kanun&apos;un 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları çerçevesinde, iş ortaklarımıza, tedarikçilerimize, kanunen yetkili kamu kurumlarına ve özel kişilere aktarılabilecektir.
                </p>

                {/* Placeholder Warning */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mt-8">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        * Bu metin bir örnektir. Lütfen kendi şirketinizin KVKK politikasına uygun olarak güncelleyiniz.
                    </p>
                </div>
            </div>
        </div>
    );
}
