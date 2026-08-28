import Image from "next/image";
import Link from "next/link";
import { categories } from "../products";

type CategoryRowProps = {
  activeSlug: string;
};

export default function CategoryRow({ activeSlug }: CategoryRowProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-14">
      <h2 className="text-2xl font-bold text-zinc-900">Shop By Category</h2>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const isActive = category.slug === activeSlug;

          return (
            <Link
              key={category.slug}
              // Clicking an active tile clears the filter.
              href={isActive ? "/#products" : `/?category=${category.slug}#products`}
              className={`group relative aspect-square overflow-hidden rounded-xl shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                isActive ? "ring-2 ring-orange-500 ring-offset-2" : ""
              }`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition duration-300 group-hover:scale-110"
              />

              {/* Dark gradient so the white label stays readable */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

              <span className="absolute inset-x-0 bottom-0 p-3 text-center text-sm font-semibold text-white">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
