import Link from "next/link";

const items = [
  { href: "/stash", label: "Stash" },
  { href: "/projects", label: "Projects" },
  { href: "/guide", label: "Guide" },
  { href: "/circles", label: "Circles" },
  { href: "/account", label: "Account" },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
      <ul className="grid grid-cols-5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-center py-3 text-[11px] text-[var(--text-secondary)] active:text-[var(--primary)]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
