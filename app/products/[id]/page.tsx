import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../../components/AddToCartButton";
import { notFound } from "next/navigation";
import { products, getFinalPrice, getCategoryBySlug } from "../../products";

export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">) {
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
  const finalPrice = getFinalPrice(product);
  const category = getCategoryBySlug(product.category);

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-orange-500">
            Home
          </Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/category/${category.slug}`}
                className="transition hover:text-orange-500"
              >
                {category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="font-medium text-zinc-900">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          {/* Image placeholder */}
          <div className="relative h-80 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />

            {hasDiscount && (
              <span className="absolute top-4 left-4 z-10 rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold tracking-wide text-orange-600 uppercase transition hover:bg-orange-100"
              >
                {category.name}
              </Link>
            )}

            <h1 className="mt-3 text-3xl font-bold text-zinc-900">
              {product.name}
            </h1>

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

            <AddToCartButton
              product={product}
              className="mt-6 w-fit px-6 py-3"
            />

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
