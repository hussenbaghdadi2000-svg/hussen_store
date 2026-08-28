import Link from "next/link";

const footerLinks = [
  {
    title: "Quick Links",
    links: ["Home", "Shop", "Categories", "About Us"],
  },
  {
    title: "Customer Service",
    links: ["Contact Us", "Shipping Policy", "Returns", "FAQ"],
  },
  {
    title: "My Account",
    links: ["My Orders", "Wishlist", "Track Order", "Login"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-900 text-zinc-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🛍️</span>
            <span className="text-xl font-bold tracking-tight text-white">
              Mini<span className="text-orange-500">Store</span>
            </span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed">
            A small Next.js demo shop built to practise the App Router, React
            state, and Tailwind CSS.
          </p>
        </div>

        {footerLinks.map((column) => (
          <div key={column.title}>
            <h3 className="font-semibold text-white">{column.title}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link}>
                  <span className="cursor-pointer transition hover:text-orange-500">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-800 px-6 py-5 text-center text-xs">
        © 2026 MiniStore. Built with Next.js and Tailwind CSS.
      </div>
    </footer>
  );
}
