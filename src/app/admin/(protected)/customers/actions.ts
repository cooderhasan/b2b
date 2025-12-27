"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateCustomerStatus(
    customerId: string,
    status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED",
    role?: "CUSTOMER" | "DEALER"
) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR")) {
        throw new Error("Unauthorized");
    }

    await prisma.user.update({
        where: { id: customerId },
        data: {
            status,
            ...(role && { role }),
        },
    });

    // Log the action
    await prisma.adminLog.create({
        data: {
            adminId: session.user.id,
            action: "UPDATE_CUSTOMER_STATUS",
            entityType: "User",
            entityId: customerId,
            newData: { status, role },
        },
    });

    revalidatePath("/admin/customers");
}

export async function updateCustomerDiscountGroup(
    customerId: string,
    discountGroupId: string
) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR")) {
        throw new Error("Unauthorized");
    }

    const customer = await prisma.user.findUnique({
        where: { id: customerId },
        select: { discountGroupId: true },
    });

    await prisma.user.update({
        where: { id: customerId },
        data: { discountGroupId },
    });

    // Log the action
    await prisma.adminLog.create({
        data: {
            adminId: session.user.id,
            action: "UPDATE_DISCOUNT_GROUP",
            entityType: "User",
            entityId: customerId,
            oldData: { discountGroupId: customer?.discountGroupId },
            newData: { discountGroupId },
        },
    });

    revalidatePath("/admin/customers");
}
