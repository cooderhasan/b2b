"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

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

export async function createCustomer(data: {
    companyName: string;
    taxNumber: string;
    email: string;
    phone: string;
    password: string;
    discountGroupId: string;
}) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR")) {
        throw new Error("Unauthorized");
    }

    const { companyName, taxNumber, email, phone, password, discountGroupId } = data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { success: false, error: "Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var." };
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            companyName,
            taxNumber,
            phone,
            role: "DEALER", // Manuel eklenenler direkt bayi olsun
            status: "APPROVED", // ve direkt onaylı
            discountGroupId: discountGroupId || null,
        },
    });

    // ... existing code ...

    revalidatePath("/admin/customers");
    return { success: true };
}

export async function updateCustomerCreditLimit(
    customerId: string,
    creditLimit: number
) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR")) {
        throw new Error("Unauthorized");
    }

    const previousUser = await prisma.user.findUnique({
        where: { id: customerId },
        select: { creditLimit: true }
    });

    await prisma.user.update({
        where: { id: customerId },
        data: {
            creditLimit,
        },
    });

    // Log the action
    await prisma.adminLog.create({
        data: {
            adminId: session.user.id,
            action: "UPDATE_CREDIT_LIMIT",
            entityType: "User",
            entityId: customerId,
            oldData: { creditLimit: previousUser?.creditLimit ? Number(previousUser.creditLimit) : 0 },
            newData: { creditLimit },
        },
    });

    revalidatePath("/admin/customers");
    return { success: true };
}

export async function getCustomerTransactions(userId: string) {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR")) {
        throw new Error("Unauthorized");
    }

    const transactions = await prisma.currentAccountTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    // Serialize Decimal to Number for Client Component
    return transactions.map(t => ({
        ...t,
        amount: Number(t.amount),
    }));
}
