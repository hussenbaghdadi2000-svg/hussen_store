"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { useCart } from "../context/CartContext";
import { placeOrderAction, type CheckoutState } from "../lib/checkout-actions";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "../lib/pricing";
import { getFinalPrice } from "../products";

const inputClass =
  "w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

type FieldProps = {
  name: string;
  label: string;
  error?: string;
  defaultValue?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function Field({ name, label, error, defaultValue, ...rest }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        className={`mt-1 ${inputClass}`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function CheckoutForm() {
  const { cartItems, cartTotal } = useCart();

  const [state, formAction, isPending] = useActionState<CheckoutState, FormData>(
    placeOrderAction,
    {},
  );

  if (cartItems.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
        <p className="text-5xl">🛒</p>
        <h2 className="mt-4 text-xl font-bold text-zinc-900">
          Nothing to check out
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Add a product to your cart first.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = cartTotal + shipping;

  // Only ids and quantities go to the server - never prices.
  const cartPayload = JSON.stringify(
    cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
  );

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <input type="hidden" name="cart" value={cartPayload} />

      <div className="space-y-8">
        {state.error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {state.error}
          </p>
        )}

        {/* Shipping address */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-bold text-zinc-900">Shipping address</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field
                name="fullName"
                label="Full name"
                autoComplete="name"
                defaultValue={state.values?.fullName}
                error={state.fieldErrors?.fullName}
              />
            </div>

            <div className="sm:col-span-2">
              <Field
                name="line1"
                label="Address"
                autoComplete="street-address"
                defaultValue={state.values?.line1}
                error={state.fieldErrors?.line1}
              />
            </div>

            <Field
              name="city"
              label="City"
              autoComplete="address-level2"
              defaultValue={state.values?.city}
              error={state.fieldErrors?.city}
            />

            <Field
              name="postcode"
              label="Postcode"
              autoComplete="postal-code"
              defaultValue={state.values?.postcode}
              error={state.fieldErrors?.postcode}
            />

            <div className="sm:col-span-2">
              <Field
                name="country"
                label="Country"
                autoComplete="country-name"
                defaultValue={state.values?.country}
                error={state.fieldErrors?.country}
              />
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-bold text-zinc-900">Payment</h2>

          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">
              ⚠️ Demo only — do not enter a real card
            </p>
            <p className="mt-1">
              No payment is processed and nothing leaves this app. Use these
              test numbers:
            </p>
            <ul className="mt-2 space-y-0.5 font-mono text-xs">
              <li>4242 4242 4242 4242 — succeeds</li>
              <li>4000 0000 0000 0002 — declined</li>
              <li>4000 0000 0000 9995 — insufficient funds</li>
            </ul>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field
                name="cardNumber"
                label="Card number"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                autoComplete="off"
                error={state.fieldErrors?.cardNumber}
              />
            </div>

            <Field
              name="cardExpiry"
              label="Expiry (MM/YY)"
              placeholder="12/30"
              inputMode="numeric"
              autoComplete="off"
              error={state.fieldErrors?.cardExpiry}
            />

            <Field
              name="cardCvc"
              label="Security code"
              placeholder="123"
              inputMode="numeric"
              autoComplete="off"
              error={state.fieldErrors?.cardCvc}
            />
          </div>
        </section>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold text-zinc-900">Order summary</h2>

        <ul className="mt-4 space-y-3">
          {cartItems.map((item) => (
            <li key={item.product.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {item.product.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {item.quantity} × ${getFinalPrice(item.product).toFixed(2)}
                </p>
              </div>

              <p className="text-sm font-semibold text-zinc-900">
                ${(getFinalPrice(item.product) * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 border-t border-zinc-200 pt-4 text-sm">
          <div className="flex justify-between text-zinc-500">
            <dt>Subtotal</dt>
            <dd>${cartTotal.toFixed(2)}</dd>
          </div>

          <div className="flex justify-between text-zinc-500">
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
          </div>

          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900">
            <dt>Total</dt>
            <dd>${total.toFixed(2)}</dd>
          </div>
        </dl>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
        >
          {isPending ? "Processing payment..." : `Pay $${total.toFixed(2)}`}
        </button>

        <p className="mt-3 text-center text-xs text-zinc-400">
          Totals are recalculated on the server before charging.
        </p>
      </aside>
    </form>
  );
}
