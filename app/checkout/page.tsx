import Link from "next/link";
import { redirect } from "next/navigation";
import CheckoutForm from "../components/CheckoutForm";
import { getCurrentUser } from "../lib/session";

export const metadata = { title: "Checkout | Mini Store" };

export default async function CheckoutPage() {
  // Real check. Middleware only does an optimistic cookie check.
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");

  return (
    <main className="flex-1 bg-zinc-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <Link href="/cart" className="transition hover:text-orange-500">
            Cart
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-zinc-900">Checkout</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold text-zinc-900">Checkout</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Signed in as {user.email}
        </p>

        <div className="mt-8">
          <CheckoutForm />
        </div>
      </div>
    </main>
  );
}
