import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-8">{children}</main>
      <MobileNav />
    </div>
  );
}
