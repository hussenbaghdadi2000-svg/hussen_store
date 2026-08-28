import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { Product, getFinalPrice } from "../products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  // Derived values: calculated from props, not stored in state.
  const hasDiscount = product.discount > 0;
  const finalPrice = getFinalPrice(product);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Image + discount badge */}
      <Link
        href={`/products/${product.id}`}
        className="relative block h-48 overflow-hidden bg-zinc-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />

        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
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

        <AddToCartButton product={product} className="mt-2" />
      </div>
    </div>
  );
}
