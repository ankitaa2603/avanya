import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { BrandLogo } from "@/components/Brand";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AVANYA — A branch in your pocket" },
      {
        name: "description",
        content:
          "AI Voice Assistant for Navigation & YONO Adoption. Help every SBI customer bank digitally with confidence — in their own language.",
      },
      { property: "og:title", content: "AVANYA — A branch in your pocket" },
      {
        property: "og:description",
        content:
          "AI Voice Assistant for Navigation & YONO Adoption — built for SBI Global FinTech Fest 2026.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    title: "Voice-first guidance",
    body: "Customers speak in Hindi, English, or Hinglish. AVANYA listens, explains, and walks them through every step.",
  },
  {
    title: "Guided banking flows",
    body: "Statement download, FD creation, UPI setup, ATM PIN reset — simulated end-to-end, with the next button highlighted.",
  },
  {
    title: "Digital Confidence Score",
    body: "Every successful action raises a measurable score across UPI, FD, bills, statements, and PIN management.",
  },
  {
    title: "Senior-friendly UI",
    body: "One-tap Senior Mode for larger fonts, calmer spacing, and simpler navigation. Built for Bharat.",
  },
  {
    title: "Responsible AI",
    body: "Consent before mic use. No OTP, PIN, or password is ever requested. Clear escalation to a human.",
  },
  {
    title: "Branch deflection insights",
    body: "Admin analytics turn customer queries into measurable branch traffic reduction and operational savings.",
  },
];

const METRICS = [
  { value: "40%", label: "Reduction in routine branch visits" },
  { value: "35%", label: "Increase in digital adoption" },
  { value: "90%", label: "Self-service completion rate" },
  { value: "60%", label: "Faster issue resolution" },
];

const STEPS = [
  { n: 1, t: "Sign in", d: "One-tap demo login as a real customer persona." },
  { n: 2, t: "Ask in your language", d: "Speak or type. AVANYA understands Hindi, English, and Hinglish." },
  { n: 3, t: "Get guided", d: "Step-by-step navigation through the YONO journey." },
  { n: 4, t: "Build confidence", d: "Every success raises your Digital Confidence Score." },
];

function Landing() {
  const router = useRouter();
  const { setDemoMode } = useStore();

  function startJudgeDemo() {
    setDemoMode(true);
    router.navigate({ to: "/login" });
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border bg-card/70 backdrop-blur sticky top-0 z-30">
        <div className="container-page h-16 flex items-center justify-between">
          <BrandLogo />
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#impact" className="hover:text-foreground">Impact</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:inline-flex h-9 items-center px-3 text-sm font-medium text-foreground hover:text-brand"
            >
              Sign in
            </Link>
            <button
              type="button"
              onClick={startJudgeDemo}
              className="inline-flex h-9 items-center px-3.5 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Start Judge Demo
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container-page pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" /> SBI Global FinTech Fest 2026 · Team Mavericks
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-foreground">
              Every customer deserves <br className="hidden md:block" />
              <span className="text-brand">a branch in their pocket.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
              AVANYA is an AI-powered digital banking companion that helps every SBI customer — especially the elderly,
              first-time, and digitally hesitant — confidently use YONO without visiting a branch.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={startJudgeDemo}
                className="inline-flex h-11 items-center px-5 rounded-lg bg-brand text-brand-foreground font-medium hover:opacity-90 transition-opacity shadow-card"
              >
                Try the Demo →
              </button>
              <Link
                to="/login"
                className="inline-flex h-11 items-center px-5 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted"
              >
                Choose a persona
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-xl">
              {METRICS.map((m) => (
                <div key={m.label}>
                  <dt className="text-2xl font-semibold text-foreground">{m.value}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground leading-snug">{m.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero card mock */}
          <div className="relative">
            <div className="absolute -inset-6 bg-brand-soft rounded-[28px] -z-10" aria-hidden />
            <div className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-success" />
                  <span className="text-xs font-medium text-muted-foreground">YONO · AVANYA Assistant</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Live</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand text-brand-foreground px-4 py-2.5 text-sm">
                    Mujhe statement download karna hai
                  </div>
                </div>
                <div className="flex justify-start gap-2">
                  <div className="size-7 rounded-full bg-brand-soft text-brand text-xs font-bold flex items-center justify-center">A</div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted text-foreground px-4 py-3 text-sm leading-relaxed">
                    Bilkul. Main aapko 4 simple steps mein guide karti hoon —
                    <ol className="mt-2 list-decimal pl-5 space-y-1 text-muted-foreground">
                      <li>Accounts par jaayein</li>
                      <li>Apna account select karein</li>
                      <li>Statement &amp; period chunein</li>
                      <li>PDF download karein</li>
                    </ol>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-brand-soft/60 p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-brand font-medium">Confidence boost</div>
                    <div className="text-sm text-foreground font-medium">+15 on Statement Download</div>
                  </div>
                  <div className="text-2xl font-semibold text-brand">82</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-card">
        <div className="container-page py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">What AVANYA does</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
              A calm, capable companion inside every YONO session.
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <article key={f.title} className="rounded-2xl border border-border bg-background p-6 hover:shadow-card transition-shadow">
                <div className="size-10 rounded-lg bg-brand-soft text-brand font-semibold flex items-center justify-center">
                  {f.title.charAt(0)}
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container-page py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">How it works</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            Four steps from confusion to confidence.
          </h2>
        </div>
        <ol className="mt-12 grid md:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs font-medium text-muted-foreground">Step {s.n}</div>
              <div className="mt-3 text-lg font-semibold text-foreground">{s.t}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Impact */}
      <section id="impact" className="border-t border-border bg-card">
        <div className="container-page py-20 grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Why it matters for SBI</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
              Financial inclusion you can measure.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
              Millions of customers still visit a branch for balance enquiry, statement downloads, FD creation, or
              ATM PIN resets. AVANYA shifts those journeys to YONO — without leaving anyone behind.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-4">
            {[
              ["Financial Inclusion", "Voice + Hinglish for non-English first-time users."],
              ["Customer Centricity", "Companion, not chatbot. Calm, respectful, in-context."],
              ["Operational Efficiency", "Routine queries move out of branches and call centres."],
              ["Responsible AI", "Consent-led, explainable, no sensitive data captured."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-border bg-background p-5">
                <div className="text-sm font-semibold text-foreground">{t}</div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-page py-20">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Frequently asked</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {[
            ["Is this a chatbot?", "No. AVANYA is a guided in-app companion that highlights the next action and explains banking concepts in plain language."],
            ["Which languages does it support?", "Hindi, English, and Hinglish. Voice and text input are both available."],
            ["Will it ask for OTP or PIN?", "Never. AVANYA is explicitly forbidden from requesting OTP, PIN, CVV, or passwords."],
            ["Does it work on slow networks?", "Yes. Low-bandwidth mode keeps the experience responsive on 2G/3G connections."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-2xl border border-border bg-card p-6">
              <div className="font-medium text-foreground">{q}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-brand to-brand-2 text-brand-foreground p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-elevated">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">See the 2-minute judge demo</h3>
            <p className="mt-2 text-brand-foreground/80 max-w-lg">
              Sign in as Shanti Devi, ask AVANYA for a statement in Hinglish, and watch confidence score rise.
            </p>
          </div>
          <button
            type="button"
            onClick={startJudgeDemo}
            className="inline-flex h-12 items-center px-6 rounded-xl bg-card text-brand font-semibold hover:bg-card/90"
          >
            Start Judge Demo →
          </button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container-page py-10 flex flex-col md:flex-row justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <BrandLogo />
          </div>
          <div>© 2026 Team Mavericks · Built for SBI Global FinTech Fest · Demo environment</div>
        </div>
      </footer>
    </div>
  );
}
