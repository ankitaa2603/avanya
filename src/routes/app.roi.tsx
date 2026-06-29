import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator, Building2, IndianRupee, TrendingUp, Clock } from "lucide-react";

export const Route = createFileRoute("/app/roi")({
  head: () => ({ meta: [{ title: "ROI Calculator · AVANYA" }] }),
  component: ROI,
});

// Assumptions (transparent to the manager)
const COST_PER_BRANCH_VISIT = 120;     // ₹
const MIN_PER_BRANCH_VISIT  = 12;       // employee minutes per visit
const DEFLECTION_FACTOR     = 0.65;     // 65% of AVANYA users' visits get avoided
const ADOPTION_LIFT_FACTOR  = 0.55;     // 55% of AVANYA penetration converts to digital uplift

function ROI() {
  const [visits, setVisits] = useState(20000);
  const [pct, setPct] = useState(45);

  const out = useMemo(() => {
    const adopters = visits * (pct / 100);
    const visitsAvoided = Math.round(adopters * DEFLECTION_FACTOR);
    const costSaved = visitsAvoided * COST_PER_BRANCH_VISIT;
    const hoursSaved = Math.round((visitsAvoided * MIN_PER_BRANCH_VISIT) / 60);
    const adoptionLift = Math.round(pct * ADOPTION_LIFT_FACTOR);
    return { visitsAvoided, costSaved, hoursSaved, adoptionLift };
  }, [visits, pct]);

  return (
    <div className="space-y-8 animate-fade-up">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">For SBI Branch Managers</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight">ROI Calculator</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Estimate the operational impact of deploying AVANYA across your branch. Adjust the inputs to model your own scenario.
        </p>
      </header>

      <div className="grid lg:grid-cols-[420px_1fr] gap-6">
        {/* Inputs */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card h-fit">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="size-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <div>
              <div className="font-semibold">Your branch inputs</div>
              <div className="text-xs text-muted-foreground">Monthly figures</div>
            </div>
          </div>

          <div className="mt-6 space-y-7">
            <Field
              label="Monthly branch visits"
              hint="Routine visits — balance, statement, PIN, simple enquiries"
              min={1000} max={100000} step={500} value={visits} onChange={setVisits}
              format={(v) => v.toLocaleString("en-IN")}
            />
            <Field
              label="Customers using AVANYA"
              hint="% of your active customers onboarded to AVANYA"
              min={5} max={100} step={5} value={pct} onChange={setPct}
              format={(v) => `${v}%`}
            />
          </div>

          <details className="mt-6 text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground">Assumptions used</summary>
            <ul className="mt-3 space-y-1.5 pl-4 list-disc">
              <li>Avg. cost per routine branch visit: ₹{COST_PER_BRANCH_VISIT}</li>
              <li>Avg. employee time per visit: {MIN_PER_BRANCH_VISIT} mins</li>
              <li>Deflection rate among AVANYA users: {DEFLECTION_FACTOR * 100}%</li>
              <li>Adoption lift factor: {ADOPTION_LIFT_FACTOR * 100}%</li>
            </ul>
          </details>
        </section>

        {/* Outputs */}
        <section className="grid sm:grid-cols-2 gap-5 content-start">
          <OutCard
            icon={Building2} tone="brand"
            label="Branch visits reduced"
            value={out.visitsAvoided.toLocaleString("en-IN")}
            unit="visits / month"
          />
          <OutCard
            icon={IndianRupee} tone="success"
            label="Estimated cost savings"
            value={`₹ ${(out.costSaved / 100000).toFixed(2)} L`}
            unit="per month"
          />
          <OutCard
            icon={TrendingUp} tone="brand"
            label="Digital adoption lift"
            value={`+${out.adoptionLift} pts`}
            unit="vs baseline"
          />
          <OutCard
            icon={Clock} tone="success"
            label="Employee hours saved"
            value={out.hoursSaved.toLocaleString("en-IN")}
            unit="hours / month"
          />

          <div className="sm:col-span-2 rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-soft to-card p-6 shadow-card">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Annualised impact</div>
            <div className="mt-2 grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-muted-foreground">Cost savings / year</div>
                <div className="mt-1 text-2xl font-semibold text-brand tabular-nums">
                  ₹ {((out.costSaved * 12) / 10000000).toFixed(2)} Cr
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Visits avoided / year</div>
                <div className="mt-1 text-2xl font-semibold text-foreground tabular-nums">
                  {(out.visitsAvoided * 12).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label, hint, min, max, step, value, onChange, format,
}: {
  label: string; hint?: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void; format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-lg font-semibold text-brand tabular-nums">{format(value)}</span>
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[color:var(--brand)]"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1 tabular-nums">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

function OutCard({
  icon: Icon, label, value, unit, tone,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string; value: string; unit: string; tone: "brand" | "success";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elevated transition-shadow">
      <div className={"size-10 rounded-xl flex items-center justify-center " + (tone === "success"
        ? "bg-success/10 text-success" : "bg-brand-soft text-brand")}>
        <Icon size={20} />
      </div>
      <div className="mt-4 text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{unit}</div>
    </div>
  );
}