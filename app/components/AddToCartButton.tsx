"use client";

import { useCart } from "../context/CartContext";
import { Product } from "../products";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
};

export default function AddToCartButton({
  product,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className={`rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95 ${className}`}
    >
      Add to Cart
    </button>
  );
}
