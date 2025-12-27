import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "OPERATOR") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <AdminSidebar />
            <div className="lg:pl-64">
                <AdminHeader user={session.user} />
                <main className="py-6 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
