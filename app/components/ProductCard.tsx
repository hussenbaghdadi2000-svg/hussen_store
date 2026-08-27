import Link from "next/link";
import { Product } from "../products";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  // Derived values: calculated from props, not stored in state.
  const hasDiscount = product.discount > 0;
  const finalPrice = product.price * (1 - product.discount / 100);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Image placeholder + discount badge — links to the detail page */}
      <Link
        href={`/products/${product.id}`}
        className="relative flex h-40 items-center justify-center bg-zinc-100 text-6xl"
      >
        {product.emoji}

        {hasDiscount && (
          <span className="absolute top-2 left-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
            -{product.discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-zinc-900">
          <Link
            href={`/products/${product.id}`}
            className="transition hover:text-orange-500"
          >
            {product.name}
          </Link>
        </h3>

        {/* Star rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={
                star <= Math.round(product.rating)
                  ? "text-orange-400"
                  : "text-zinc-300"
              }
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-xs text-zinc-500">({product.rating})</span>
        </div>

        {/* Prices */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg font-bold text-zinc-900">
            ${finalPrice.toFixed(2)}
          </span>

          {hasDiscount && (
            <span className="text-sm text-zinc-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="mt-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
