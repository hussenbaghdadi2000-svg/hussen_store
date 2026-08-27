import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-20 text-center">
      <p className="text-6xl">🔍</p>
      <h1 className="mt-4 text-3xl font-bold text-zinc-900">
        Product not found
      </h1>
      <p className="mt-2 text-zinc-500">
        We could not find the page you were looking for.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
      >
        Back to store
      </Link>
    </main>
  );
}
