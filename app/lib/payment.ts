/**
 * ============================================================
 *  SIMULATED PAYMENT GATEWAY - FOR LEARNING ONLY
 * ============================================================
 * This file fakes what Stripe/PayPal would do. In a real app:
 *
 *   - The card number NEVER reaches your server. The browser
 *     sends it straight to the payment provider, which returns
 *     a token; your server only ever sees that token.
 *   - Touching real card data puts you under PCI-DSS compliance.
 *   - You never store the number, the CVC, or the expiry.
 *
 * We only ever keep the brand and the last 4 digits, which is
 * what a real integration gives you back.
 */

export type PaymentResult =
  | { ok: true; brand: string; last4: string; reference: string }
  | { ok: false; error: string };

export type CardInput = {
  number: string;
  expiry: string; // MM/YY
  cvc: string;
  amountCents: number;
};

/**
 * Luhn checksum - the same check every real card form runs.
 * Catches typos before you waste a call to the payment provider.
 */
export function luhnCheck(digits: string): boolean {
  if (digits.length < 12) return false;

  let sum = 0;
  let double = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits.charCodeAt(i) - 48;

    if (digit < 0 || digit > 9) return false;

    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    double = !double;
  }

  return sum % 10 === 0;
}

export function detectBrand(digits: string): string {
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6/.test(digits)) return "Discover";
  return "Card";
}

/** Expiry must parse as MM/YY and be in the future. */
function isExpiryValid(expiry: string): boolean {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(expiry.trim());
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);

  if (month < 1 || month > 12) return false;

  // Valid through the last day of the expiry month.
  const expiresAt = new Date(year, month, 1).getTime();
  return expiresAt > Date.now();
}

// Test cards, mirroring the ones Stripe documents.
const DECLINE_CARDS = new Set(["4000000000000002"]);
const INSUFFICIENT_FUNDS = new Set(["4000000000009995"]);

export async function chargeCard(input: CardInput): Promise<PaymentResult> {
  const digits = input.number.replace(/[\s-]/g, "");

  if (!/^\d+$/.test(digits)) {
    return { ok: false, error: "Card number must contain digits only" };
  }

  if (!luhnCheck(digits)) {
    return { ok: false, error: "That card number is not valid" };
  }

  if (!isExpiryValid(input.expiry)) {
    return { ok: false, error: "Card expiry is invalid or in the past" };
  }

  if (!/^\d{3,4}$/.test(input.cvc.trim())) {
    return { ok: false, error: "Security code must be 3 or 4 digits" };
  }

  if (input.amountCents <= 0) {
    return { ok: false, error: "Order total must be greater than zero" };
  }

  // Pretend to call the payment provider.
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (DECLINE_CARDS.has(digits)) {
    return { ok: false, error: "Your card was declined" };
  }

  if (INSUFFICIENT_FUNDS.has(digits)) {
    return { ok: false, error: "Insufficient funds" };
  }

  return {
    ok: true,
    brand: detectBrand(digits),
    last4: digits.slice(-4),
    reference: `demo_${Math.random().toString(36).slice(2, 10)}`,
  };
}
