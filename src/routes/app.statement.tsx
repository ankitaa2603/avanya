import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/statement")({
  component: StatementFlow,
});

const STEPS = [
  {
    title: "Open Accounts",
    body: "YONO ke home se 'Accounts' tab par tap karein. Yahan aapke saare SBI accounts dikhenge.",
    cta: "Go to Accounts",
  },
  {
    title: "Choose your account",
    body: "Apna Savings Account select karein (account ending 4521).",
    cta: "Select account",
  },
  {
    title: "Pick statement period",
    body: "Time period chunein — pichhle 1 mahine ka statement default hai.",
    cta: "Last 1 month",
  },
  {
    title: "Download PDF",
    body: "PDF format mein download karein. Statement aapke device par save ho jayegi.",
    cta: "Download statement",
  },
];

function StatementFlow() {
  const router = useRouter();
  const { persona, demoMode, bumpScore, unlock, setDemoMode } = useStore();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function next() {
    if (autoRef.current) clearTimeout(autoRef.current);
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }

  function finish() {
    bumpScore("statement", 25);
    unlock("first_statement");
    setDone(true);
    // Subtle banking-appropriate confetti
    try {
      const colors = ["#1C4FA3", "#2E6FD8", "#16A34A", "#F59E0B"];
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.35 }, colors, scalar: 0.85, ticks: 160 });
      setTimeout(() => confetti({ particleCount: 40, spread: 90, origin: { y: 0.45 }, colors, scalar: 0.7 }), 220);
    } catch { /* noop */ }
    if (demoMode) {
      autoRef.current = setTimeout(() => {
        setDemoMode(false);
        router.navigate({ to: "/app" });
      }, 3200);
    }
  }

  // Demo auto-advance
  useEffect(() => {
    if (!demoMode || done) return;
    autoRef.current = setTimeout(() => next(), step === 0 ? 1400 : 1600);
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode, step, done]);

  if (!persona) return null;
  const pct = done ? 100 : Math.round(((step) / STEPS.length) * 100);

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
      <section className="rounded-2xl border border-border bg-card p-7 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Guided journey</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Download account statement</h1>
          </div>
          {demoMode && !done && (
            <span className="text-[11px] uppercase tracking-wider text-brand font-medium flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-brand animate-pulse" /> Auto demo
            </span>
          )}
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-brand transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <ol className="mt-7 space-y-3">
          {STEPS.map((s, i) => {
            const status = done ? "done" : i < step ? "done" : i === step ? "active" : "pending";
            return (
              <li
                key={s.title}
                className={
                  "rounded-xl border p-4 transition-all " +
                  (status === "active"
                    ? "border-brand bg-brand-soft shadow-card"
                    : status === "done"
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-background opacity-70")
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={
                      "shrink-0 size-7 rounded-full flex items-center justify-center text-xs font-bold " +
                      (status === "done"
                        ? "bg-success text-white"
                        : status === "active"
                        ? "bg-brand text-brand-foreground"
                        : "bg-muted text-muted-foreground")
                    }
                  >
                    {status === "done" ? "✓" : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">{s.title}</div>
                    {status === "active" && (
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {!done ? (
          <div className="mt-7 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.navigate({ to: "/app/assistant" })}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to AVANYA
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex h-11 items-center px-5 rounded-xl bg-brand text-brand-foreground font-medium hover:opacity-90 shadow-card animate-[pulse_2.5s_ease-in-out_infinite]"
            >
              {STEPS[step].cta} →
            </button>
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-success/30 bg-success/5 p-5 animate-fade-up">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-success text-white font-bold flex items-center justify-center animate-check-pop">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <div className="font-semibold text-foreground">Statement downloaded</div>
                <div className="text-sm text-muted-foreground">
                  Achievement unlocked: First Statement Download · +25 confidence
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.navigate({ to: "/app" })}
              className="mt-4 inline-flex h-10 items-center px-4 rounded-lg bg-foreground text-background text-sm font-medium"
            >
              Back to dashboard →
            </button>
          </div>
        )}
      </section>

      {/* Simulated YONO preview */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-brand-soft via-card to-card p-5 shadow-card">
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div className="text-sm font-semibold text-brand">YONO · Statement</div>
            <div className="text-[10px] uppercase text-muted-foreground">Simulated</div>
          </div>
          <PreviewBody step={done ? STEPS.length : step} accountNo={persona.accountNo} />
        </div>
        <p className="mt-3 text-[11px] text-center text-muted-foreground">
          AVANYA overlays guidance on a YONO-like surface. No real banking APIs are called.
        </p>
      </section>
    </div>
  );
}

function PreviewBody({ step, accountNo }: { step: number; accountNo: string }) {
  return (
    <div className="p-5 min-h-[420px] space-y-3 text-sm">
      <div
        className={
          "rounded-xl border p-3 transition-all " +
          (step === 0 ? "border-brand ring-2 ring-brand/30 bg-brand-soft" : "border-border")
        }
      >
        <div className="text-xs text-muted-foreground">Tab</div>
        <div className="font-medium">Accounts</div>
      </div>
      {step >= 1 && (
        <div
          className={
            "rounded-xl border p-3 transition-all " +
            (step === 1 ? "border-brand ring-2 ring-brand/30 bg-brand-soft" : "border-border")
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Savings Account</div>
              <div className="font-medium">{accountNo}</div>
            </div>
            <span className="text-xs text-success font-medium">Active</span>
          </div>
        </div>
      )}
      {step >= 2 && (
        <div
          className={
            "rounded-xl border p-3 transition-all " +
            (step === 2 ? "border-brand ring-2 ring-brand/30 bg-brand-soft" : "border-border")
          }
        >
          <div className="text-xs text-muted-foreground">Period</div>
          <div className="flex gap-1.5 mt-1.5">
            {["1M", "3M", "6M", "1Y"].map((p, i) => (
              <span
                key={p}
                className={
                  "px-2.5 py-1 rounded-md text-xs font-medium " +
                  (i === 0 ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground")
                }
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
      {step >= 3 && (
        <div
          className={
            "rounded-xl border p-4 transition-all " +
            (step === 3 ? "border-brand ring-2 ring-brand/30 bg-brand-soft" : "border-border")
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Statement_June2026.pdf</div>
              <div className="text-xs text-muted-foreground">42 KB · Ready</div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-brand font-medium text-sm">⤓ Download</span>
          </div>
        </div>
      )}
      {step >= 4 && (
        <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-success font-medium text-sm">
          ✓ PDF saved to your device
        </div>
      )}
    </div>
  );
}