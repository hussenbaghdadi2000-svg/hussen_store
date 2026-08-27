"use client";

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import { products, Product } from "./products";

export default function Home() {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  function addToCart(product: Product) {
    setCartItems((prevItems) => [...prevItems, product]);
  }

  return (
    <>
      <Header cartCount={cartItems.length} />

      <main className="flex-1">
        <Hero />

        <section id="products" className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="text-2xl font-bold text-zinc-900">
            Best Selling Products
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
