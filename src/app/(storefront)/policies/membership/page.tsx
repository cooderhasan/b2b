export default function MembershipAgreementPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                Üyelik Sözleşmesi
            </h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    1. TARAFLAR
                </h3>
                <p>
                    İşbu Sözleşme aşağıdaki taraflar arasında aşağıda belirtilen hüküm ve şartlar çerçevesinde imzalanmıştır.
                </p>
                <p>
                    <strong>&apos;ALICI&apos; (ÜYE)</strong><br />
                    Ad-Soyad/Firma: [Üye Bilgisi]
                </p>
                <p>
                    <strong>&apos;SATICI&apos; (HİZMET SAĞLAYICI)</strong><br />
                    Ünvanı: [Şirket Adı]
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    2. SÖZLEŞMENİN KONUSU
                </h3>
                <p>
                    İşbu Sözleşme&apos;nin konusu, ÜYE&apos;nin SATICI&apos;ya ait internet sitesine üye olması ve bu platform üzerinden sunulan hizmetlerden yararlanma şartlarının belirlenmesidir.
                </p>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
                    3. ÜYELİK ŞARTLARI
                </h3>
                <p>
                    Üye, siteye kayıt olurken verdiği bilgilerin doğru ve güncel olduğunu taahhüt eder. Yanlış bilgi verilmesi durumunda doğacak zararlardan Üye sorumludur.
                </p>
            </div>
        </div>
    );
}
