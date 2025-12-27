import { auth } from "@/lib/auth";
import { StorefrontHeader } from "@/components/storefront/header";
import { StorefrontFooter } from "@/components/storefront/footer";
import { Toaster } from "@/components/ui/sonner";
import { getSiteSettings } from "@/lib/settings";

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const settings = await getSiteSettings();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <StorefrontHeader user={session?.user} logoUrl={settings.logoUrl} siteName={settings.siteName} />
            <main className="flex-1">{children}</main>
            <StorefrontFooter settings={settings} />
        </div>
    );
}
