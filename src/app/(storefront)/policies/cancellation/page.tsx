export default function CancellationPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                İptal ve İade Koşulları
            </h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    Cayma Hakkı
                </h3>
                <p>
                    ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkını kullanabilir.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    İade Şartları
                </h3>
                <p>
                    İade edilecek ürünlerin kutusu, ambalajı, varsa standart aksesuarları ile birlikte eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir. Kullanılmış, tahrip edilmiş veya tekrar satılabilirliğini yitirmiş ürünlerin iadesi kabul edilmemektedir.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    İade Süreci
                </h3>
                <p>
                    İade talebiniz onaylandıktan sonra, ürün bedeli ödeme yaptığınız yöntemle (kredi kartı veya havale/EFT) tarafınıza iade edilecektir. Banka süreçlerine bağlı olarak iadenin hesabınıza yansıması birkaç gün sürebilir.
                </p>
            </div>
        </div>
    );
}
