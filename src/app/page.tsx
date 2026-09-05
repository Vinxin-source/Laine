import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-serif mb-4">Terms</h1>
      <Card padding="lg" className="max-w-2xl text-sm text-[var(--text-secondary)] space-y-3 leading-relaxed">
        <p>
          Laine provides software tools for personal yarn and project organisation and optional
          private Circles among makers.
        </p>
        <p>
          You are responsible for content you post. Do not share paid patterns you do not have
          rights to distribute. Do not harass others. Circle owners may remove members who break
          room rules.
        </p>
        <p>
          The free tier and Maker subscription ($9/month) features are described on the pricing
          page and may evolve. Subscriptions are billed by our payment provider (Merchant of
          Record).
        </p>
        <p>
          Laine Guide answers from your logged data and does not replace professional advice or
          official pattern instructions. We do not guarantee uninterrupted service.
        </p>
        <p>These terms will be finalized with your business details before public launch.</p>
      </Card>
    </AppShell>
  );
}
