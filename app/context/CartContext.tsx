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

   useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        // Reading localStorage during render would break hydration
        // (server has no localStorage), so the effect is correct here.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCartItems(JSON.parse(saved));
      } catch {
        // Corrupted data - just start with an empty cart.
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

   useEffect(() => {
 
    if (!isLoaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, isLoaded]);

  function addToCart(product: Product) {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);

       if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

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
