export type Category = {
  slug: string; // used in the URL, e.g. /?category=electronics
  name: string; // shown to the user
  image: string;
};

export const categories: Category[] = [
  {
    slug: "electronics",
    name: "Electronics",
    image: "/categories/electronics.jpg",
  },
  { slug: "fashion", name: "Fashion", image: "/categories/fashion.jpg" },
  { slug: "home-living", name: "Home & Living", image: "/categories/home.jpg" },
  { slug: "beauty", name: "Beauty", image: "/categories/beauty.jpg" },
  { slug: "sports", name: "Sports", image: "/categories/sports.jpg" },
  { slug: "toys-games", name: "Toys & Games", image: "/categories/toys.jpg" },
];

export type Product = {
  id: number;
  name: string;
  price: number;
  discount: number; // percent off, 0 means no discount
  rating: number; // out of 5
  image: string; // path inside /public
  category: string; // matches a Category slug
};

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 89.99,
    discount: 10,
    rating: 4.5,
    image: "/products/headphones.jpg",
    category: "electronics",
  },
  {
    id: 2,
    name: "Coffee Mug",
    price: 12.5,
    discount: 0,
    rating: 4.0,
    image: "/products/mug.jpg",
    category: "home-living",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: 129.0,
    discount: 15,
    rating: 4.8,
    image: "/products/keyboard.jpg",
    category: "electronics",
  },
  {
    id: 4,
    name: "Desk Lamp",
    price: 34.95,
    discount: 5,
    rating: 3.9,
    image: "/products/lamp.jpg",
    category: "home-living",
  },
  {
    id: 5,
    name: "Backpack",
    price: 59.0,
    discount: 20,
    rating: 4.6,
    image: "/products/backpack.jpg",
    category: "fashion",
  },
  {
    id: 6,
    name: "Running Shoes",
    price: 74.25,
    discount: 25,
    rating: 4.2,
    image: "/products/shoes.jpg",
    category: "sports",
  },
  {
    id: 7,
    name: "Makeup Palette Set",
    price: 42.0,
    discount: 12,
    rating: 4.4,
    image: "/products/brushes.jpg",
    category: "beauty",
  },
  {
    id: 8,
    name: "Building Blocks Set",
    price: 27.99,
    discount: 0,
    rating: 4.7,
    image: "/products/blocks.jpg",
    category: "toys-games",
  },
];

// One place that knows how to apply a discount.
export function getFinalPrice(product: Product): number {
  return product.price * (1 - product.discount / 100);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
