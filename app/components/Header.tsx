"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Left: logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🛍️</span>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            Mini<span className="text-orange-500">Store</span>
          </span>
        </Link>

        {/* Right: cart */}
        <Link
          href="/cart"
          className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          <span>🛒</span>
          <span>Cart</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-semibold text-white">
            {cartCount}
          </span>
        </Link>
      </div>
    </header>
  );
}
