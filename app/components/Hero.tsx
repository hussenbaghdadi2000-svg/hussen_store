import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-linear-to-r from-orange-50 to-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-6 py-16 md:flex-row md:justify-between">
        {/* Left: the text */}
        <div className="max-w-lg text-center md:text-left">
          <p className="text-sm font-semibold tracking-wider text-orange-500 uppercase">
            New Collection
          </p>

          <h1 className="mt-3 text-4xl leading-tight font-bold text-zinc-900 md:text-5xl">
            Discover The Best <span className="text-orange-500">Products</span>{" "}
            Online
          </h1>

          <p className="mt-4 text-zinc-600">
            Shop top-quality products at unbeatable prices. Exclusive deals just
            for you.
          </p>

          <a
            href="#products"
            className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Shop Now
          </a>
        </div>

        {/* Right: image placeholder */}
        <div className="relative h-56 w-56 shrink-0 overflow-hidden rounded-full bg-white shadow-sm md:h-64 md:w-64">
          <Image
            src="/hero-watch.jpg"
            alt="Smart watch"
            fill
            sizes="(max-width: 768px) 224px, 256px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
