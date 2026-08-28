"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { getFinalPrice } from "../products";

export default function CartPage() {
  const { cartItems, cartTotal, addToCart, decreaseQuantity, removeFromCart, clearCart } =
    useCart();

  // Empty state - show this instead of an empty table.
  if (cartItems.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-20 text-center">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-zinc-500">
          Add a few products and they will show up here.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-zinc-900">Your Cart</h1>

        <ul className="mt-8 space-y-4">
          {cartItems.map((item) => (
            <li
              key={item.product.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-40 flex-1">
                <Link
                  href={`/products/${item.product.id}`}
                  className="font-semibold text-zinc-900 transition hover:text-orange-500"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-zinc-500">
                  ${getFinalPrice(item.product).toFixed(2)} each
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-3 rounded-lg border border-zinc-200 px-2 py-1">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${item.product.name}`}
                  onClick={() => decreaseQuantity(item.product.id)}
                  className="px-2 text-lg text-zinc-600 transition hover:text-orange-500"
                >
                  −
                </button>

                <span className="w-6 text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  aria-label={`Increase quantity of ${item.product.name}`}
                  onClick={() => addToCart(item.product)}
                  className="px-2 text-lg text-zinc-600 transition hover:text-orange-500"
                >
                  +
                </button>
              </div>

              <p className="w-20 text-right font-bold text-zinc-900">
                ${(getFinalPrice(item.product) * item.quantity).toFixed(2)}
              </p>

              <button
                type="button"
                aria-label={`Remove ${item.product.name} from cart`}
                onClick={() => removeFromCart(item.product.id)}
                className="text-sm text-zinc-400 transition hover:text-red-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm text-zinc-500">
            <span>Shipping</span>
            <span>{cartTotal > 99 ? "Free" : "$4.99"}</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-lg font-bold text-zinc-900">
            <span>Total</span>
            <span>
              ${(cartTotal > 99 ? cartTotal : cartTotal + 4.99).toFixed(2)}
            </span>
          </div>

          {/* Out of scope for this demo - marked clearly instead of
              looking like a button that is simply broken. */}
          <button
            type="button"
            disabled
            title="Checkout is not part of this demo"
            className="mt-6 w-full cursor-not-allowed rounded-lg bg-orange-500/50 px-6 py-3 font-medium text-white"
          >
            Checkout (demo only)
          </button>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link
              href="/"
              className="text-zinc-500 transition hover:text-orange-500"
            >
              ← Continue shopping
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className="text-zinc-400 transition hover:text-red-500"
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
