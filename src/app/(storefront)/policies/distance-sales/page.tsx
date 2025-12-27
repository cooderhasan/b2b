export default function DistanceSalesPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                Mesafeli Satış Sözleşmesi
            </h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    MADDE 1 - TARAFLAR
                </h3>
                <p>
                    <strong>SATICI:</strong><br />
                    Ünvanı: [Şirket Adı]<br />
                    Adresi: [Adres]<br />
                    Telefon: [Telefon]<br />
                    E-posta: [Email]
                </p>
                <p>
                    <strong>ALICI:</strong><br />
                    Müşteri olarak siteye üye olan veya sipariş veren kişi.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    MADDE 2 - KONU
                </h3>
                <p>
                    İşbu sözleşmenin konusu, ALICI&apos;nın SATICI&apos;ya ait internet sitesinden elektronik ortamda siparişini yaptığı ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
                </p>

                {/* Placeholder Warning */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mt-8">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        * Standart mesafeli satış sözleşmesi metnidir. Şirket bilgilerinizi doldurunuz.
                    </p>
                </div>
            </div>
        </div>
    );
}
