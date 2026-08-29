import { getFinalPrice, products } from "../products";

export const FREE_SHIPPING_THRESHOLD = 99;
export const SHIPPING_FEE = 4.99;
export const MAX_QUANTITY_PER_ITEM = 20;

/** What the browser sends us: ids and quantities. Nothing else. */
export type CartLineInput = {
  productId: number;
  quantity: number;
};

export type OrderItem = {
  productId: number;
  name: string;
  image: string;
  unitPrice: number; // decided by the SERVER, never the client
  quantity: number;
  lineTotal: number;
};

export type PricedCart = {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export type PricingResult =
  | { ok: true; cart: PricedCart }
  | { ok: false; error: string };

/** Money maths on floats needs rounding at every step. */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function toCents(value: number): number {
  return Math.round(value * 100);
}

/**
 * Rebuilds the whole cart from trusted data.
 *
 * SECURITY: the browser only tells us WHICH products and HOW MANY.
 * Every price, discount, subtotal and total is looked up and
 * recalculated here. If the client sent us prices, a user could
 * edit them in DevTools and buy a $129 keyboard for $0.01.
 */
export function priceCart(lines: CartLineInput[]): PricingResult {
  if (lines.length === 0) {
    return { ok: false, error: "Your cart is empty" };
  }

  const seen = new Set<number>();
  const items: OrderItem[] = [];

  for (const line of lines) {
    if (seen.has(line.productId)) {
      return { ok: false, error: "Duplicate product in cart" };
    }
    seen.add(line.productId);

    const product = products.find((item) => item.id === line.productId);

    if (!product) {
      return { ok: false, error: "A product in your cart is no longer available" };
    }

    if (
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > MAX_QUANTITY_PER_ITEM
    ) {
      return { ok: false, error: `Invalid quantity for ${product.name}` };
    }

    const unitPrice = round2(getFinalPrice(product));

    items.push({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice,
      quantity: line.quantity,
      lineTotal: round2(unitPrice * line.quantity),
    });
  }

  const subtotal = round2(items.reduce((sum, item) => sum + item.lineTotal, 0));
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return {
    ok: true,
    cart: { items, subtotal, shipping, total: round2(subtotal + shipping) },
  };
}
