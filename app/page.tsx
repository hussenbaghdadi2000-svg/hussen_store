import CategoryRow from "./components/CategoryRow";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductSearch from "./components/ProductSearch";
import { categories, products } from "./products";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />

      <ProductSearch />

      <CategoryRow />

      <section id="products" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl font-bold text-zinc-900">All Products</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {products.length} products across {categories.length} categories
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
