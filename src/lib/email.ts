import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/components/emails/order-confirmation';
import { AdminNewOrderEmail } from '@/components/emails/admin-new-order';

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

interface SendOrderConfirmationProps {
    to: string;
    orderNumber: string;
    customerName: string;
    items: {
        productName: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
    }[];
    subtotal: number;
    discountAmount: number;
    vatAmount: number;
    total: number;
    shippingAddress: {
        address: string;
        city: string;
        district?: string;
    };
    cargoCompany?: string;
}

interface SendAdminNewOrderProps {
    orderNumber: string;
    customerName: string;
    total: number;
    orderId: string;
    cargoCompany?: string;
}

export async function sendOrderConfirmationEmail(props: SendOrderConfirmationProps) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Email sending skipped.');
        return { success: false, error: 'API key missing' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Sipariş <onboarding@resend.dev>', // Update this with your verified domain later
            to: [props.to],
            subject: `Siparişiniz Alındı - #${props.orderNumber}`,
            react: OrderConfirmationEmail(props),
        });

        if (error) {
            console.error('Email sending error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error };
    }
}

export async function sendAdminNewOrderEmail(props: SendAdminNewOrderProps) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Admin email sending skipped.');
        return { success: false, error: 'API key missing' };
    }

    if (!ADMIN_EMAIL) {
        console.warn('ADMIN_EMAIL is not set. Admin email sending skipped.');
        return { success: false, error: 'Admin email missing' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Sipariş Bildirim <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `Yeni Sipariş: #${props.orderNumber} - ${props.customerName}`,
            react: AdminNewOrderEmail(props),
        });

        if (error) {
            console.error('Admin email sending error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Admin email sending failed:', error);
        return { success: false, error };
    }
}
