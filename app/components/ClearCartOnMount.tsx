"use client";

import { useEffect } from "react";
import { useCart } from "../context/CartContext";

/**
 * The order is already recorded on the server, but the cart lives in
 * the browser (Context + localStorage). This empties it once, when the
 * confirmation page mounts.
 */
export default function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // Run once on mount. clearCart is stable for the life of the provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
