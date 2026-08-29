"use server";

import { redirect } from "next/navigation";
import { createOrder, type ShippingAddress } from "./orders";
import { chargeCard } from "./payment";
import { priceCart, toCents, type CartLineInput } from "./pricing";
import { getCurrentUser } from "./session";

export type CheckoutState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

const ADDRESS_FIELDS = [
  { name: "fullName", label: "Full name", min: 2 },
  { name: "line1", label: "Address", min: 4 },
  { name: "city", label: "City", min: 2 },
  { name: "postcode", label: "Postcode", min: 3 },
  { name: "country", label: "Country", min: 2 },
] as const;

export async function placeOrderAction(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  // 1. Must be logged in. Checked here too, not just in middleware.
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");

  // 2. Read the cart the browser sent - ids and quantities only.
  let lines: CartLineInput[];

  try {
    const parsed: unknown = JSON.parse(String(formData.get("cart") ?? "[]"));

    if (!Array.isArray(parsed)) throw new Error("not an array");

    lines = parsed.map((line) => ({
      productId: Number((line as CartLineInput).productId),
      quantity: Number((line as CartLineInput).quantity),
    }));
  } catch {
    return { error: "We could not read your cart. Please try again." };
  }

  // 3. Rebuild every price from server data. Never trust the client.
  const pricing = priceCart(lines);
  if (!pricing.ok) return { error: pricing.error };

  // 4. Validate the shipping address.
  const fieldErrors: Record<string, string> = {};
  const values: Record<string, string> = {};

  for (const field of ADDRESS_FIELDS) {
    const value = String(formData.get(field.name) ?? "").trim();
    values[field.name] = value;

    if (value.length < field.min) {
      fieldErrors[field.name] = `${field.label} is required`;
    }
  }

  const cardNumber = String(formData.get("cardNumber") ?? "");
  const cardExpiry = String(formData.get("cardExpiry") ?? "");
  const cardCvc = String(formData.get("cardCvc") ?? "");

  if (!cardNumber.trim()) fieldErrors.cardNumber = "Card number is required";
  if (!cardExpiry.trim()) fieldErrors.cardExpiry = "Expiry is required";
  if (!cardCvc.trim()) fieldErrors.cardCvc = "Security code is required";

  if (Object.keys(fieldErrors).length > 0) {
    // Note: card values are deliberately NOT echoed back.
    return { fieldErrors, values };
  }

  // 5. Charge (simulated).
  const payment = await chargeCard({
    number: cardNumber,
    expiry: cardExpiry,
    cvc: cardCvc,
    amountCents: toCents(pricing.cart.total),
  });

  if (!payment.ok) {
    return { error: payment.error, values };
  }

  // 6. Record the order. Only brand + last4 are kept from the card.
  const address: ShippingAddress = {
    fullName: values.fullName,
    line1: values.line1,
    city: values.city,
    postcode: values.postcode,
    country: values.country,
  };

  const order = createOrder({
    userId: user.id,
    items: pricing.cart.items,
    subtotal: pricing.cart.subtotal,
    shipping: pricing.cart.shipping,
    total: pricing.cart.total,
    address,
    cardBrand: payment.brand,
    cardLast4: payment.last4,
    paymentReference: payment.reference,
  });

  redirect(`/orders/${order.id}`);
}
