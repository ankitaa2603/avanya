import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const ACHIEVEMENTS_CATALOG: { id: string; title: string; desc: string }[] = [
  { id: "first_statement", title: "First Statement Download", desc: "Self-served an account statement" },
  { id: "first_upi", title: "First UPI Payment", desc: "Sent money confidently via UPI" },
  { id: "first_fd", title: "First Fixed Deposit", desc: "Opened an FD inside YONO" },
  { id: "first_pin_reset", title: "First ATM PIN Reset", desc: "Reset PIN without visiting a branch" },
];

const SCORE_LABELS: { key: keyof ReturnType<typeof useStore>["scores"]; label: string }[] = [
  { key: "upi", label: "UPI" },
  { key: "fd", label: "Fixed Deposits" },
  { key: "statement", label: "Statement" },
  { key: "bills", label: "Bill Payments" },
  { key: "pin", label: "PIN Management" },
];

function Dashboard() {
  const { persona, scores, achievements, overallScore, demoMode } = useStore();
  if (!persona) return null;

  const greeting = `Namaste, ${persona.name.split(" ")[0]}`;

  return (
    <div className="space-y-8">
      {/* Greeting + score */}
      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="rounded-2xl border border-border bg-card p-7 md:p-9 shadow-card">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{greeting}</h1>
          <p className="mt-2 text-muted-foreground">
            Aapka digital banking companion ready hai. Pucho — voice ya text mein.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <Link
              to="/app/assistant"
              className="rounded-xl border border-brand bg-brand text-brand-foreground px-4 py-3 text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-between"
            >
              <span>Talk to AVANYA</span>
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/app/statement"
              className="rounded-xl border border-border bg-background hover:bg-muted px-4 py-3 text-sm font-medium flex items-center justify-between"
            >
              <span>Download statement</span>
              <span aria-hidden>→</span>
            </Link>
            <button
              type="button"
              disabled
              className="rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground flex items-center justify-between cursor-not-allowed"
              title="Coming soon"
            >
              <span>Open FD</span>
              <span className="text-[10px] uppercase">Soon</span>
            </button>
          </div>
          {demoMode && (
            <Link
              to="/app/assistant"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3 py-1.5 text-xs text-brand font-medium hover:bg-brand-soft/80"
            >
              <span className="size-1.5 rounded-full bg-brand animate-pulse" />
              Judge Demo in progress — continue to AVANYA →
            </Link>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Digital Confidence Score
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Across 5 banking journeys</div>
            </div>
            <ConfidenceRing value={overallScore} />
          </div>
          <div className="mt-5 space-y-3">
            {SCORE_LABELS.map(({ key, label }) => (
              <div key={key}>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{label}</span>
                  <span className="text-muted-foreground tabular-nums">{scores[key]}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-brand transition-all duration-700"
                    style={{ width: `${scores[key]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Account overview */}
      <section className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Savings Account</div>
              <div className="text-foreground font-medium mt-0.5">{persona.accountNo}</div>
            </div>
            <span className="text-[11px] uppercase tracking-wider text-success font-medium">Active</span>
          </div>
          <div className="mt-5">
            <div className="text-xs text-muted-foreground">Available balance</div>
            <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
              ₹ {persona.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <ul className="mt-6 divide-y divide-border border-t border-border">
            {[
              { d: "29 Jun", t: "UPI to Mohan Kirana", a: -480 },
              { d: "27 Jun", t: "Pension credit · GOVT", a: 28500 },
              { d: "24 Jun", t: "Electricity bill · MSEDCL", a: -1240 },
              { d: "21 Jun", t: "SBI Recurring Deposit", a: -5000 },
            ].map((tx) => (
              <li key={tx.t} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="text-foreground">{tx.t}</div>
                  <div className="text-xs text-muted-foreground">{tx.d}</div>
                </div>
                <div className={"tabular-nums font-medium " + (tx.a > 0 ? "text-success" : "text-foreground")}>
                  {tx.a > 0 ? "+" : "−"}₹ {Math.abs(tx.a).toLocaleString("en-IN")}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Achievements</div>
          <div className="mt-4 space-y-3">
            {ACHIEVEMENTS_CATALOG.map((a) => {
              const unlocked = achievements.includes(a.id);
              return (
                <div
                  key={a.id}
                  className={
                    "rounded-xl border p-3.5 transition-colors " +
                    (unlocked
                      ? "border-success/30 bg-success/5"
                      : "border-border bg-background opacity-70")
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{a.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{a.desc}</div>
                    </div>
                    <span
                      className={
                        "shrink-0 size-7 rounded-full flex items-center justify-center text-xs font-bold " +
                        (unlocked ? "bg-success text-white" : "bg-muted text-muted-foreground")
                      }
                      aria-hidden
                    >
                      {unlocked ? "✓" : "•"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Recommendation */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-brand-soft to-card p-6 shadow-card">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-xl bg-brand text-brand-foreground font-bold flex items-center justify-center">A</div>
          <div className="flex-1">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-brand">AVANYA recommends</div>
            <p className="mt-1 text-foreground">
              Aapne is mahine ₹2,000 save kiya hai — kya ek 6-mahine ki FD set karna chahenge? Returns approx 7.1%.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="text-sm font-medium px-3 py-1.5 rounded-lg bg-brand text-brand-foreground hover:opacity-90">
                Yes, guide me
              </button>
              <button className="text-sm font-medium px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted">
                Not now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ConfidenceRing({ value }: { value: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative size-20">
      <svg viewBox="0 0 72 72" className="size-20 -rotate-90">
        <circle cx="36" cy="36" r={r} className="stroke-muted" strokeWidth="6" fill="none" />
        <circle
          cx="36"
          cy="36"
          r={r}
          className="stroke-brand transition-all duration-700"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-semibold text-foreground tabular-nums">
        {value}
      </div>
    </div>
  );
}