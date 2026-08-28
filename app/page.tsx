import Link from "next/link";
import CategoryRow from "./components/CategoryRow";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductSearch from "./components/ProductSearch";
import { products, getCategoryBySlug } from "./products";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { category } = await searchParams;

  // A query string can be a string, an array, or missing - normalise it.
  const activeSlug = typeof category === "string" ? category : "";
  const activeCategory = getCategoryBySlug(activeSlug);

  const visibleProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory.slug)
    : products;

  return (
    <main className="flex-1">
      <Hero />

      <ProductSearch />

      <CategoryRow activeSlug={activeCategory ? activeCategory.slug : ""} />

      <section id="products" className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-zinc-900">
            {activeCategory ? activeCategory.name : "Best Selling Products"}
          </h2>

          {activeCategory && (
            <Link
              href="/#products"
              className="text-sm font-medium text-orange-500 hover:underline"
            >
              Clear filter ✕
            </Link>
          )}
        </div>

        <p className="mt-1 text-sm text-zinc-500">
          {visibleProducts.length} product
          {visibleProducts.length === 1 ? "" : "s"}
        </p>

        {visibleProducts.length === 0 ? (
          <p className="mt-8 rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
            No products in this category yet.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
