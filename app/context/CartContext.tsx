"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product, getFinalPrice } from "../products";

// One line in the cart: which product, and how many.
export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "mini-store-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Have we finished reading localStorage yet?
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. On mount only: read the saved cart out of the browser.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {
        // Corrupted data - just start with an empty cart.
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  // 2. Whenever the cart changes, write it back.
  useEffect(() => {
    // Skip the very first render, before step 1 has run,
    // otherwise we would overwrite the saved cart with [].
    if (!isLoaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, isLoaded]);

  function addToCart(product: Product) {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);

      // Already in the cart -> bump its quantity by one.
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      // Not in the cart yet -> add a new line.
      return [...prevItems, { product, quantity: 1 }];
    });
  }

  function decreaseQuantity(productId: number) {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        // Drop any line that hit zero.
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(productId: number) {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  // Derived values - recalculated on every render.
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + getFinalPrice(item.product) * item.quantity,
    0,
  );

  const value: CartContextType = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used inside a <CartProvider>");
  }

  return context;
}
