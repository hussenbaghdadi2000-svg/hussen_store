import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ClearCartOnMount from "../../components/ClearCartOnMount";
import { getOrderForUser } from "../../lib/orders";
import { getCurrentUser } from "../../lib/session";

export const metadata = { title: "Order confirmed | Mini Store" };

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  // Ownership is enforced inside getOrderForUser.
  const order = getOrderForUser(id, user.id);
  if (!order) notFound();

  return (
    <main className="flex-1 bg-zinc-50">
      <ClearCartOnMount />

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <p className="text-5xl">✅</p>
          <h1 className="mt-3 text-2xl font-bold text-green-900">
            Thank you, {order.address.fullName.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-sm text-green-800">
            Your demo order has been placed. No payment was actually taken.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-wide text-zinc-500 uppercase">
                Order number
              </p>
              <p className="mt-0.5 font-mono text-sm text-zinc-900">
                {order.id}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs tracking-wide text-zinc-500 uppercase">
                Placed
              </p>
              <p className="mt-0.5 text-sm text-zinc-900">
                {order.createdAt.toLocaleString("en-GB")}
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-4 border-t border-zinc-200 pt-6">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.productId}`}
                    className="font-medium text-zinc-900 transition hover:text-orange-500"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-zinc-500">
                    {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>

                <p className="font-semibold text-zinc-900">
                  ${item.lineTotal.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-zinc-200 pt-4 text-sm">
            <div className="flex justify-between text-zinc-500">
              <dt>Subtotal</dt>
              <dd>${order.subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-zinc-500">
              <dt>Shipping</dt>
              <dd>
                {order.shipping === 0
                  ? "Free"
                  : `$${order.shipping.toFixed(2)}`}
              </dd>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900">
              <dt>Total paid</dt>
              <dd>${order.total.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-6 grid gap-6 border-t border-zinc-200 pt-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xs tracking-wide text-zinc-500 uppercase">
                Shipping to
              </h2>
              <address className="mt-1 text-sm text-zinc-900 not-italic">
                {order.address.fullName}
                <br />
                {order.address.line1}
                <br />
                {order.address.city}, {order.address.postcode}
                <br />
                {order.address.country}
              </address>
            </div>

            <div>
              <h2 className="text-xs tracking-wide text-zinc-500 uppercase">
                Paid with
              </h2>
              <p className="mt-1 text-sm text-zinc-900">
                {order.cardBrand} ending {order.cardLast4}
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-400">
                ref {order.paymentReference}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-zinc-500 transition hover:text-orange-500"
          >
            ← Continue shopping
          </Link>

          <Link
            href="/account"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            View my orders
          </Link>
        </div>
      </div>
    </main>
  );
}
