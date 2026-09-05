import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-serif text-[var(--text-primary)] max-w-2xl leading-tight mb-6">
          The calm home for your yarn and projects
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-md mb-10 leading-relaxed">
          Organise what you own. Finish what you start. Connect with makers who care — without the noise.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/signup">
            <Button size="lg">Start free</Button>
          </Link>
          <Link href="/guide">
            <Button variant="secondary" size="lg">
              Meet Laine Guide
            </Button>
          </Link>
        </div>

        <p className="mt-14 text-sm text-[var(--text-secondary)]">
          Built for serious knitters & crocheters · $9/month after free tier · Install on your phone
        </p>

        <div className="mt-10 flex gap-4 text-xs text-[var(--text-secondary)]">
          <Link href="/pricing" className="hover:text-[var(--primary)]">
            Pricing
          </Link>
          <Link href="/privacy" className="hover:text-[var(--primary)]">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[var(--primary)]">
            Terms
          </Link>
        </div>
      </main>
    </div>
  );
}
