"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import type { PublicUser } from "../lib/users";

type HeaderProps = {
  user: PublicUser | null;
};

export default function Header({ user }: HeaderProps) {
  const { cartCount } = useCart();

  const firstName = user ? user.name.split(" ")[0] : null;

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

        {/* Right: account + cart */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
                {firstName?.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline">{firstName}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:text-orange-500"
            >
              Sign in
            </Link>
          )}

          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Cart</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-semibold text-white">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
