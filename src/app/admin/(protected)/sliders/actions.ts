"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createSlider(data: {
    title?: string;
    subtitle?: string;
    imageUrl: string;
    linkUrl?: string;
    order?: number
}) {
    await prisma.slider.create({
        data: {
            title: data.title,
            subtitle: data.subtitle,
            imageUrl: data.imageUrl,
            linkUrl: data.linkUrl,
            order: data.order ?? 0,
        },
    });
    revalidatePath("/admin/sliders");
}

export async function updateSlider(id: string, data: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    linkUrl?: string;
    order?: number;
    isActive?: boolean
}) {
    await prisma.slider.update({
        where: { id },
        data,
    });
    revalidatePath("/admin/sliders");
}

export async function deleteSlider(id: string) {
    await prisma.slider.delete({
        where: { id },
    });
    revalidatePath("/admin/sliders");
}

export async function toggleSliderStatus(id: string, isActive: boolean) {
    await prisma.slider.update({
        where: { id },
        data: { isActive },
    });
    revalidatePath("/admin/sliders");
}
