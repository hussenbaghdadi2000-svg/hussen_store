import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "../../products";

// Tell Next.js which ids exist, so it can build these pages ahead of time.
export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

// Sets the browser tab title per product.
export async function generateMetadata({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));

  return {
    title: product ? `${product.name} | Mini Store` : "Product not found",
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    notFound();
  }

  const hasDiscount = product.discount > 0;
  const finalPrice = product.price * (1 - product.discount / 100);

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-500 transition hover:text-orange-500"
        >
          ← Back to store
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          {/* Image placeholder */}
          <div className="relative flex h-80 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-8xl">
            {product.emoji}

            {hasDiscount && (
              <span className="absolute top-4 left-4 rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-zinc-900">{product.name}</h1>

            <div className="mt-3 flex items-center gap-1">
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
              <span className="ml-1 text-sm text-zinc-500">
                ({product.rating} out of 5)
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-zinc-900">
                ${finalPrice.toFixed(2)}
              </span>

              {hasDiscount && (
                <span className="text-lg text-zinc-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-zinc-600">
              This is a demo product for the Mini Store project. In a real shop
              this text would come from a database or a CMS.
            </p>

            <ul className="mt-5 space-y-1 text-sm text-zinc-600">
              <li>✓ Free shipping on orders over $99</li>
              <li>✓ 30-day money-back guarantee</li>
              <li>✓ 24/7 customer support</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
