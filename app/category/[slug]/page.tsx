import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import {
  categories,
  getCategoryBySlug,
  getProductsByCategory,
} from "../../products";

// Pre-build one page per category.
export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  return {
    title: category ? `${category.name} | Mini Store` : "Category not found",
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <main className="flex-1 bg-zinc-50">
      {/* Banner */}
      <div className="relative h-44 w-full overflow-hidden sm:h-56">
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="text-3xl font-bold sm:text-4xl">{category.name}</h1>
          <p className="mt-1 text-sm text-white/80">
            {categoryProducts.length} product
            {categoryProducts.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-orange-500">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-zinc-900">{category.name}</span>
        </nav>

        {/* Jump to another category */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((item) => {
            const isActive = item.slug === category.slug;

            return (
              <Link
                key={item.slug}
                href={`/category/${item.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {categoryProducts.length === 0 ? (
          <p className="mt-10 rounded-xl border border-zinc-200 bg-white p-10 text-center text-zinc-500">
            No products in this category yet.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
