import { prisma } from "@/lib/db";
import { CustomersTable } from "@/components/admin/customers-table";

export default async function CustomersPage() {
    const customers = await prisma.user.findMany({
        where: {
            role: { in: ["CUSTOMER", "DEALER"] },
        },
        include: {
            discountGroup: true,
            _count: {
                select: { orders: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const discountGroups = await prisma.discountGroup.findMany({
        where: { isActive: true },
        orderBy: { discountRate: "asc" },
    });

    const serializedCustomers = customers.map(customer => ({
        ...customer,
        discountGroup: customer.discountGroup ? {
            ...customer.discountGroup,
            discountRate: Number(customer.discountGroup.discountRate)
        } : null
    }));

    const serializedDiscountGroups = discountGroups.map(group => ({
        ...group,
        discountRate: Number(group.discountRate)
    }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Müşteri Yönetimi
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Bayi onayı ve iskonto grubu ataması yapın.
                </p>
            </div>

            <CustomersTable customers={serializedCustomers} discountGroups={serializedDiscountGroups} />
        </div>
    );
}
