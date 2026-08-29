import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "../lib/auth-actions";
import { getOrdersForUser } from "../lib/orders";
import { getCurrentUser } from "../lib/session";

export const metadata = { title: "My account | Mini Store" };

export default async function AccountPage() {
  const user = await getCurrentUser();

  // Not logged in -> bounce to the login page.
  if (!user) redirect("/login");

  const orders = getOrdersForUser(user.id);

  return (
    <main className="flex-1 bg-zinc-50 px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-zinc-900">My account</h1>

        {/* Profile */}
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs tracking-wide text-zinc-500 uppercase">
                Name
              </dt>
              <dd className="mt-0.5 font-medium text-zinc-900">{user.name}</dd>
            </div>

            <div>
              <dt className="text-xs tracking-wide text-zinc-500 uppercase">
                Email
              </dt>
              <dd className="mt-0.5 font-medium text-zinc-900">{user.email}</dd>
            </div>
          </dl>

          <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6">
            <Link
              href="/"
              className="text-sm text-zinc-500 transition hover:text-orange-500"
            >
              ← Continue shopping
            </Link>

            {/* A plain form whose action is a Server Action. */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Orders */}
        <h2 className="mt-12 text-2xl font-bold text-zinc-900">My orders</h2>

        {orders.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-zinc-200 bg-white p-10 text-center text-zinc-500">
            You have not placed any orders yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-mono text-sm font-medium text-zinc-900 transition hover:text-orange-500"
                    >
                      {order.id.slice(0, 8)}…
                    </Link>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {order.createdAt.toLocaleDateString("en-GB")} ·{" "}
                      {order.items.length} item
                      {order.items.length === 1 ? "" : "s"} ·{" "}
                      {order.cardBrand} ending {order.cardLast4}
                    </p>
                  </div>

                  <p className="font-bold text-zinc-900">
                    ${order.total.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      title={`${item.quantity} × ${item.name}`}
                      className="relative h-12 w-12 overflow-hidden rounded-md bg-zinc-100"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ))}

                  <Link
                    href={`/orders/${order.id}`}
                    className="ml-auto text-sm font-medium text-orange-500 hover:underline"
                  >
                    View order →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
