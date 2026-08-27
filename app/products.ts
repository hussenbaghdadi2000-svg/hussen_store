export type Product = {
  id: number;
  name: string;
  price: number;
  discount: number; // percent off, 0 means no discount
  rating: number; // out of 5
  emoji: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 89.99,
    discount: 10,
    rating: 4.5,
    emoji: "🎧",
  },
  {
    id: 2,
    name: "Coffee Mug",
    price: 12.5,
    discount: 0,
    rating: 4.0,
    emoji: "☕",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: 129.0,
    discount: 15,
    rating: 4.8,
    emoji: "⌨️",
  },
  {
    id: 4,
    name: "Desk Lamp",
    price: 34.95,
    discount: 5,
    rating: 3.9,
    emoji: "💡",
  },
  {
    id: 5,
    name: "Backpack",
    price: 59.0,
    discount: 20,
    rating: 4.6,
    emoji: "🎒",
  },
  {
    id: 6,
    name: "Running Shoes",
    price: 74.25,
    discount: 25,
    rating: 4.2,
    emoji: "👟",
  },
];
