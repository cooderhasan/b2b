import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface CategorySectionProps {
    categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
    return (
        <section className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Kategoriler
            </h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="group relative p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                    >
                        <div className="relative z-10">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                                {category.name}
                            </h3>
                            <span className="flex items-center text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                Keşfet
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
