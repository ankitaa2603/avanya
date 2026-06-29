import { createFileRoute } from "@tanstack/react-router";
import {
  Users, Smartphone, BrainCircuit, BarChart3, Database, ShieldCheck, LineChart,
} from "lucide-react";

export const Route = createFileRoute("/app/architecture")({
  head: () => ({ meta: [{ title: "System Architecture · AVANYA" }] }),
  component: Architecture,
});

const LAYERS: Array<{
  icon: React.ComponentType<{ size?: number }>;
  title: string; tag: string; body: string;
  tone: "brand" | "success" | "neutral";
}> = [
  {
    icon: Users, title: "Customer", tag: "Bharat persona",
    body: "Voice, text, Hindi / English / Hinglish. Senior-mode UI optional.",
    tone: "neutral",
  },
  {
    icon: Smartphone, title: "AVANYA Frontend", tag: "TanStack Start · React 19",
    body: "Guided flows over a YONO-like surface. Confidence score, achievements, accessibility-first.",
    tone: "brand",
  },
  {
    icon: BrainCircuit, title: "AI Engine", tag: "Gemini · Lovable AI Gateway",
    body: "Intent detection, multilingual NLU, scripted fallbacks. Never asks for OTP / PIN / CVV.",
    tone: "brand",
  },
  {
    icon: BarChart3, title: "Analytics Engine", tag: "Stream processing",
    body: "Aggregates interactions into deflection, adoption, confidence and CSAT metrics in near-real-time.",
    tone: "brand",
  },
  {
    icon: Database, title: "Databases", tag: "Postgres + Redis",
    body: "Customer profiles, session state, achievement ledger, anonymised analytics warehouse.",
    tone: "neutral",
  },
  {
    icon: LineChart, title: "Admin Dashboard", tag: "SBI Manager view",
    body: "Branch managers see real impact: visits avoided, top issues, ROI, CSAT, adoption.",
    tone: "success",
  },
];

function Architecture() {
  return (
    <div className="space-y-8 animate-fade-up">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">AVANYA · Reference architecture</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight">System Architecture</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          A clean, layered flow from the customer through AI, analytics, and back to the branch manager.
          Presentation-ready — every block is enterprise-grade.
        </p>
      </header>

      <section className="rounded-3xl border border-border bg-gradient-to-b from-brand-soft/40 via-card to-card p-6 md:p-10 shadow-card">
        <div className="mx-auto max-w-3xl space-y-4">
          {LAYERS.map((l, i) => (
            <div key={l.title} className="relative">
              <LayerCard {...l} index={i} />
              {i < LAYERS.length - 1 && (
                <div className="flex justify-center my-2" aria-hidden>
                  <div className="h-8 w-px bg-gradient-to-b from-brand/60 to-brand/10" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <Pillar
          icon={ShieldCheck} title="Responsible AI"
          body="Consent-led mic. Zero OTP/PIN/CVV requests. Human-agent escalation one tap away."
        />
        <Pillar
          icon={ShieldCheck} title="Bank-grade security"
          body="TLS in transit, AES-256 at rest. Aligned with RBI Master Direction on Digital Payments."
        />
        <Pillar
          icon={ShieldCheck} title="Built for scale"
          body="Stateless edge runtime, horizontal autoscaling. Designed for SBI's 50 Cr+ customer base."
        />
      </section>
    </div>
  );
}

function LayerCard({
  icon: Icon, title, tag, body, tone, index,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string; tag: string; body: string;
  tone: "brand" | "success" | "neutral"; index: number;
}) {
  const toneCls =
    tone === "success" ? "bg-success/10 text-success"
      : tone === "brand" ? "bg-brand text-brand-foreground"
      : "bg-muted text-foreground";
  return (
    <div
      className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card flex items-start gap-5"
      style={{ animation: `avanya-fade-up 0.45s ease-out ${index * 80}ms both` }}
    >
      <div className={"shrink-0 size-12 rounded-2xl flex items-center justify-center " + toneCls}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <span className="text-[10px] uppercase tracking-wider text-brand font-medium">{tag}</span>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>
      <div className="hidden md:flex shrink-0 size-8 rounded-full bg-brand-soft text-brand text-sm font-semibold items-center justify-center">
        {index + 1}
      </div>
    </div>
  );
}

function Pillar({
  icon: Icon, title, body,
}: { icon: React.ComponentType<{ size?: number }>; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="size-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div className="mt-4 font-semibold">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}