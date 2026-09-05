import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <Card className="w-full max-w-md" padding="lg">
          <h1 className="text-2xl font-serif mb-1">Welcome back</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Log in to your stash and projects.
          </p>
          <LoginForm />
        </Card>
      </main>
    </div>
  );
}
