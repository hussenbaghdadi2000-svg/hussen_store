# MiniStore

A small e-commerce store built with the **Next.js App Router**, **TypeScript** and **Tailwind CSS v4** — built as a learning project, with no UI or state libraries beyond React itself.

**Demo login:** `demo@ministore.com` / `demo1234`

---

## Features

**Storefront**
- 18 products across 6 categories, with discounts, ratings and real images
- Category pages at `/category/[slug]`, product pages at `/products/[id]`
- Debounced live search backed by an API route
- Cart with quantity grouping, persisted to `localStorage`

**Accounts**
- Register / sign in / sign out
- Passwords hashed with `scrypt` + a per-user salt
- Server-side sessions in an `httpOnly`, `sameSite=lax` cookie
- Protected routes via `middleware.ts` plus a real check in every page

**Checkout** *(simulated — no real payments)*
- Address + card form with Luhn validation
- **Server-side re-pricing**: the browser sends only product ids and quantities
- Order confirmation and order history

---

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment variables are required.

```bash
npm run build   # production build
npm run lint    # eslint
npx tsc --noEmit
```

---

## Architecture

```
app/
├── layout.tsx                 shell: fonts, CartProvider, Header, Footer
├── page.tsx                   home
├── products.ts                product/category data + pricing helpers
├── category/[slug]/           category pages
├── products/[id]/             product detail
├── cart/                      cart
├── checkout/                  checkout (protected)
├── orders/[id]/               order confirmation (protected)
├── account/                   profile + order history (protected)
├── login/  register/          auth pages
├── api/products/              REST endpoints
├── context/CartContext.tsx    cart state
├── components/                UI
└── lib/
    ├── password.ts            scrypt hashing + timing-safe compare
    ├── users.ts               user store
    ├── session.ts             sessions + cookies
    ├── auth-actions.ts        login / register / logout Server Actions
    ├── pricing.ts             server-side cart pricing
    ├── payment.ts             simulated payment gateway
    ├── orders.ts              order store
    └── checkout-actions.ts    place-order Server Action
middleware.ts                  optimistic route guard
```

### Notable decisions

**Server Components by default.** `"use client"` appears only on the leaves that need state or events — `CartContext`, `Header`, `AddToCartButton`, `ProductSearch`, `AuthForm`, `CheckoutForm`. Product cards and pages stay on the server.

**Cart in Context, not props.** The header lives in the root layout, which is a *parent* of the pages, so state can't flow up to it. A `CartProvider` in the layout puts the cart above both.

**Categories are routes, not query params.** A category is a destination, so it gets `/category/electronics` with its own metadata — not `/?category=electronics`.

**Prices are never trusted from the client.** Checkout sends only `{ productId, quantity }`. Every unit price, discount, shipping fee and total is recalculated server-side in `pricing.ts`. Quantities are validated as positive integers within a cap, and duplicate lines are rejected.

**Auth is checked at every layer.** Middleware does a cheap cookie-presence check for UX; the real `getCurrentUser()` check runs in each page *and* in each Server Action, because a Server Action is a public endpoint that can be called without loading the page.

### Security notes

- `scrypt` (slow, memory-hard) with a unique 16-byte salt per user
- `timingSafeEqual` for hash comparison
- Dummy hash work on unknown emails, so response time can't reveal which emails are registered
- Session ids are 32 random bytes; the cookie holds only the id, never user data
- Session rotation on login (session-fixation defence)
- Expiry enforced server-side, not just via cookie `Max-Age`
- `?next=` redirects validated against open-redirect payloads
- Order lookups require the owner's id (IDOR defence)
- Card data is never stored — only brand and last 4 digits

---

## ⚠️ Known limitations

This is a learning project, not production software.

1. **Users, sessions and orders are stored in server memory.** They are lost on restart, and they do **not** work on serverless hosting (Vercel), where each request may hit a different instance. The storefront, cart and search work fine; auth and checkout need a database first.
2. **Payments are simulated.** `lib/payment.ts` fakes a gateway. Real card details must never reach your own server — a real integration (Stripe) tokenises them in the browser, and only `chargeCard()` would change.
3. **No rate limiting** on login.
4. **No stock tracking**, email verification, or password reset.
5. Some product photos show real brands; they are Unsplash images used for illustration.

### Next steps

- Replace the in-memory stores with a database (Postgres/Prisma or SQLite/Turso)
- Rate-limit the login endpoint
- Real Stripe integration
- Stock levels and order statuses

---

## Tech

Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · Node 24
