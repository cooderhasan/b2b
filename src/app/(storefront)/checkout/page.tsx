import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CheckoutForm } from "@/components/storefront/checkout-form";

export default async function CheckoutPage() {
    const session = await auth();
    let initialData = {};

    if (session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                companyName: true,
                phone: true,
                address: true,
                city: true,
                district: true,
            },
        });

        if (user) {
            initialData = {
                name: user.companyName || "",
                phone: user.phone || "",
                address: user.address || "",
                city: user.city || "",
                district: user.district || "",
            };
        }
    }

    const cargoCompanies = await prisma.cargoCompany.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });

    return <CheckoutForm initialData={initialData} cargoCompanies={cargoCompanies} />;
}
