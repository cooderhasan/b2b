import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StorefrontHeader } from "@/components/storefront/header";
import { StorefrontFooter } from "@/components/storefront/footer";
import { Toaster } from "@/components/ui/sonner";
import { getSiteSettings } from "@/lib/settings";
import { getAllPolicies } from "@/app/actions/policy";

export default async function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const settings = await getSiteSettings();
    const categories = await prisma.category.findMany({
        where: { isActive: true, parentId: null },
        orderBy: { order: "asc" },
        select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
            children: {
                where: { isActive: true },
                select: { id: true, name: true, slug: true },
                orderBy: { order: "asc" }
            }
        },
    });

    const policies = await getAllPolicies();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <StorefrontHeader
                user={session?.user}
                logoUrl={settings.logoUrl}
                siteName={settings.siteName}
                categories={categories}
                phone={settings.phone}
                facebookUrl={settings.facebookUrl}
                instagramUrl={settings.instagramUrl}
                twitterUrl={settings.twitterUrl}
                linkedinUrl={settings.linkedinUrl}
            />
            <main className="flex-1">{children}</main>
            <StorefrontFooter settings={settings} policies={policies} />
        </div>
    );
}

