const perks = [
  { icon: "🚚", text: "Free shipping on orders over $99" },
  { icon: "↩️", text: "30-day money-back guarantee" },
  { icon: "💬", text: "24/7 customer support" },
];

export default function PromoBar() {
  return (
    <div className="bg-zinc-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-1 px-6 py-2 text-xs">
        {perks.map((perk) => (
          <span key={perk.text} className="flex items-center gap-1.5">
            <span>{perk.icon}</span>
            {perk.text}
          </span>
        ))}
      </div>
    </div>
  );
}
