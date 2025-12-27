import { prisma } from "@/lib/db";
import { SlidersTable } from "@/components/admin/sliders-table";

export default async function SlidersPage() {
    const sliders = await prisma.slider.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Slider Yönetimi
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Ana sayfa slider görsellerini yönetin
                </p>
            </div>

            <SlidersTable sliders={sliders} />
        </div>
    );
}
