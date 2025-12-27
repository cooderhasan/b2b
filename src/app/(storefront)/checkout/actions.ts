"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/helpers";
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from "@/lib/email";

interface OrderItem {
    productId: string;
    quantity: number;
    listPrice: number;
    vatRate: number;
    variantId?: string;
    variantInfo?: string;
}

interface CreateOrderData {
    items: OrderItem[];
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        district?: string;
        phone: string;
    };
    cargoCompany?: string;
    notes?: string;
    discountRate: number;
}

export async function createOrder(data: CreateOrderData) {
    const session = await auth();

    if (!session?.user) {
        return { success: false, error: "Giriş yapmanız gerekiyor." };
    }

    if (session.user.role !== "DEALER" || session.user.status !== "APPROVED") {
        return { success: false, error: "Sipariş verebilmek için bayi olmanız gerekiyor." };
    }

    try {
        // Calculate totals
        let subtotal = 0;
        let discountAmount = 0;
        let vatAmount = 0;

        const orderItems = await Promise.all(
            data.items.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new Error(`Ürün bulunamadı: ${item.productId}`);
                }

                let unitPrice = Number(product.listPrice);
                let stockToCheck = product.stock;
                let productName = product.name;

                // Handle variant if exists
                if (item.variantId) {
                    const variant = await prisma.productVariant.findUnique({
                        where: { id: item.variantId },
                    });

                    if (!variant) {
                        throw new Error(`Varyant bulunamadı: ${item.variantId}`);
                    }

                    // For variant, check variant stock instead of product stock
                    stockToCheck = variant.stock;

                    // Adjust price if needed
                    unitPrice += Number(variant.priceAdjustment);
                }

                if (item.quantity < product.minQuantity) {
                    throw new Error(
                        `${productName} için minimum sipariş adedi ${product.minQuantity}`
                    );
                }

                if (item.quantity > stockToCheck) {
                    throw new Error(
                        `${productName} için stokta sadece ${stockToCheck} adet var`
                    );
                }

                const itemSubtotal = unitPrice * item.quantity;
                const itemDiscount = itemSubtotal * (data.discountRate / 100);
                const itemDiscounted = itemSubtotal - itemDiscount;
                const itemVat = itemDiscounted * (product.vatRate / 100);
                const lineTotal = itemDiscounted + itemVat;

                subtotal += itemSubtotal;
                discountAmount += itemDiscount;
                vatAmount += itemVat;

                return {
                    productId: product.id,
                    productName: productName,
                    quantity: item.quantity,
                    unitPrice,
                    discountRate: data.discountRate,
                    vatRate: product.vatRate,
                    lineTotal,
                    variantId: item.variantId,
                    variantInfo: item.variantInfo,
                };
            })
        );

        const total = subtotal - discountAmount + vatAmount;

        // Create order with transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    userId: session.user.id,
                    subtotal,
                    discountAmount,
                    appliedDiscountRate: data.discountRate,
                    vatAmount,
                    total,
                    status: "PENDING",
                    shippingAddress: data.shippingAddress,
                    cargoCompany: data.cargoCompany,
                    notes: data.notes,
                    items: {
                        create: orderItems,
                    },
                },
            });

            // Create payment record
            await tx.payment.create({
                data: {
                    orderId: newOrder.id,
                    method: "BANK_TRANSFER",
                    status: "PENDING",
                    amount: total,
                },
            });

            // Update stock
            for (const item of data.items) {
                if (item.variantId) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                } else {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
            }

            return newOrder;
        });

        // Send confirmation email (fire and forget)
        if (session.user.email) {
            sendOrderConfirmationEmail({
                to: session.user.email,
                orderNumber: order.orderNumber,
                customerName: data.shippingAddress.name,
                items: orderItems.map((item) => ({
                    productName: item.productName,
                    quantity: item.quantity,
                    unitPrice: Number(item.unitPrice),
                    lineTotal: item.lineTotal,
                    variantInfo: item.variantInfo || undefined,
                })),
                subtotal,
                discountAmount,
                vatAmount,
                total,
                shippingAddress: {
                    address: data.shippingAddress.address,
                    city: data.shippingAddress.city,
                    district: data.shippingAddress.district,
                },
                cargoCompany: data.cargoCompany,
            }).catch((err) => {
                console.error("Failed to send order confirmation email:", err);
            });
        }

        // Send admin notification (fire and forget)
        sendAdminNewOrderEmail({
            orderNumber: order.orderNumber,
            customerName: data.shippingAddress.name,
            total,
            orderId: order.id,
            cargoCompany: data.cargoCompany,
        }).catch((err) => {
            console.error("Failed to send admin notification email:", err);
        });

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error("Order creation error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Sipariş oluşturulurken bir hata oluştu.",
        };
    }
}
