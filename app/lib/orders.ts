import { randomUUID } from "node:crypto";
import type { OrderItem } from "./pricing";

export type ShippingAddress = {
  fullName: string;
  line1: string;
  city: string;
  postcode: string;
  country: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: ShippingAddress;
  cardBrand: string;
  cardLast4: string; // the ONLY card data we keep
  paymentReference: string;
  createdAt: Date;
};

const globalForOrders = globalThis as unknown as {
  ordersById?: Map<string, Order>;
};

const ordersById = globalForOrders.ordersById ?? new Map<string, Order>();
globalForOrders.ordersById = ordersById;

export function createOrder(input: Omit<Order, "id" | "createdAt">): Order {
  const order: Order = {
    ...input,
    id: randomUUID(),
    createdAt: new Date(),
  };

  ordersById.set(order.id, order);
  return order;
}

/**
 * SECURITY: takes the userId and checks ownership here, so a caller
 * cannot forget to. Without this, anyone could read anyone else's
 * order by guessing the URL - an IDOR vulnerability.
 */
export function getOrderForUser(orderId: string, userId: string): Order | null {
  const order = ordersById.get(orderId);

  if (!order) return null;
  if (order.userId !== userId) return null;

  return order;
}

export function getOrdersForUser(userId: string): Order[] {
  return [...ordersById.values()]
    .filter((order) => order.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
