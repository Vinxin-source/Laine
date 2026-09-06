import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="w-full px-5 py-4 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm sticky top-0 z-50">
      <Link href="/" className="text-lg font-medium tracking-tight text-[var(--primary)]">
        Laine
      </Link>

      <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--text-secondary)]">
        <Link href="/stash" className="hover:text-[var(--text-primary)] transition-colors">
          Stash
        </Link>
        <Link href="/projects" className="hover:text-[var(--text-primary)] transition-colors">
          Projects
        </Link>
        <Link href="/guide" className="hover:text-[var(--text-primary)] transition-colors">
          Guide
        </Link>
        <Link href="/circles" className="hover:text-[var(--text-primary)] transition-colors">
          Circles
        </Link>
        <Link href="/pricing" className="hover:text-[var(--text-primary)] transition-colors">
          Pricing
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <Link href="/login" className="hidden sm:block">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">Start free</Button>
        </Link>
      </div>
    </header>
  );
}
