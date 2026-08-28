"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, getFinalPrice } from "../products";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    // Nothing typed -> clear everything, don't call the API.
    if (trimmed === "") {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Wait 300ms after the last keystroke before calling the API.
    const timer = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(trimmed)}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data.products);
          setIsLoading(false);
        });
    }, 300);

    // Cleanup: cancel that pending call if the user types again.
    return () => clearTimeout(timer);
  }, [query]);

  const isSearching = query.trim() !== "";

  return (
    <section className="mx-auto max-w-6xl px-6 pt-12">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>

      <input
        id="product-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products..."
        className="w-full rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />

      {isSearching && (
        <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
          {isLoading && (
            <p className="p-3 text-sm text-zinc-500">Searching...</p>
          )}

          {!isLoading && results.length === 0 && (
            <p className="p-3 text-sm text-zinc-500">
              No products match &quot;{query}&quot;.
            </p>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="divide-y divide-zinc-100">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-zinc-50"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>

                    <span className="flex-1 text-sm font-medium text-zinc-900">
                      {product.name}
                    </span>

                    <span className="text-sm font-bold text-zinc-900">
                      ${getFinalPrice(product).toFixed(2)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
