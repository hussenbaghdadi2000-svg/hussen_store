type HeaderProps = {
  cartCount: number;
};

export default function Header({ cartCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛍️</span>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            Hussen<span className="text-orange-500">Store</span>
          </span>
        </div>

        {/* Right: cart */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          <span>🛒</span>
          <span>Cart</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs font-semibold text-white">
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
}
