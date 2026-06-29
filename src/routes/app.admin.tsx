import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import {
  Building2, TrendingUp, Smile, Wallet, MessageSquareText, Gauge,
} from "lucide-react";

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin Analytics · AVANYA" }] }),
  component: AdminDashboard,
});

const adoption = [
  { m: "Jan", v: 42 }, { m: "Feb", v: 48 }, { m: "Mar", v: 53 },
  { m: "Apr", v: 61 }, { m: "May", v: 68 }, { m: "Jun", v: 77 },
];
const visitsAvoided = [
  { m: "Jan", v: 1200 }, { m: "Feb", v: 1840 }, { m: "Mar", v: 2310 },
  { m: "Apr", v: 3120 }, { m: "May", v: 4180 }, { m: "Jun", v: 5240 },
];
const issues = [
  { k: "Statement download", v: 28 },
  { k: "ATM PIN reset", v: 22 },
  { k: "Balance enquiry", v: 18 },
  { k: "Fund transfer / UPI", v: 14 },
  { k: "FD enquiry", v: 10 },
  { k: "Cheque book", v: 8 },
];
const confidence = [
  { b: "0–20", v: 6 }, { b: "21–40", v: 14 }, { b: "41–60", v: 28 },
  { b: "61–80", v: 34 }, { b: "81–100", v: 18 },
];
const csat = [
  { m: "Jan", v: 3.6 }, { m: "Feb", v: 3.8 }, { m: "Mar", v: 4.0 },
  { m: "Apr", v: 4.2 }, { m: "May", v: 4.4 }, { m: "Jun", v: 4.6 },
];

const KPIS = [
  { icon: Building2, label: "Branch visits avoided", value: "18,290", delta: "+24% vs last qtr", tone: "brand" },
  { icon: TrendingUp, label: "Digital adoption", value: "77%", delta: "+9 pts MoM", tone: "success" },
  { icon: Smile, label: "CSAT", value: "4.6 / 5", delta: "+0.2 MoM", tone: "success" },
  { icon: Wallet, label: "Estimated cost saved", value: "₹ 1.84 Cr", delta: "FY24-25 to date", tone: "brand" },
  { icon: MessageSquareText, label: "Customer queries handled", value: "62,418", delta: "94% self-served", tone: "neutral" },
  { icon: Gauge, label: "Avg. confidence score", value: "68 / 100", delta: "+11 since launch", tone: "brand" },
];

const BRAND = "#1C4FA3";
const BRAND2 = "#2E6FD8";
const SUCCESS = "#16A34A";

function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">SBI · Manager view</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight">Admin Analytics</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Branch-level impact of AVANYA across the Mumbai Metropolitan circle. Updated hourly.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          {["7D", "30D", "90D", "FY"].map((p, i) => (
            <span key={p} className={"px-3 py-1.5 rounded-md border " + (i === 2
              ? "bg-brand text-brand-foreground border-brand"
              : "border-border bg-card text-muted-foreground")}>{p}</span>
          ))}
        </div>
      </header>

      {/* KPI strip */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KPIS.map(({ icon: Icon, label, value, delta, tone }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between">
              <div className={"size-10 rounded-xl flex items-center justify-center " + (tone === "success"
                ? "bg-success/10 text-success"
                : tone === "brand" ? "bg-brand-soft text-brand" : "bg-muted text-muted-foreground")}>
                <Icon size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Live</span>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
            <div className={"mt-1 text-xs " + (tone === "success" ? "text-success" : "text-muted-foreground")}>{delta}</div>
          </div>
        ))}
      </section>

      {/* Charts row 1 */}
      <section className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Branch visits avoided" subtitle="Estimated routine visits replaced by AVANYA">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={visitsAvoided} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND2} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={BRAND2} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="m" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area dataKey="v" stroke={BRAND} strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Digital adoption growth" subtitle="% of customers active on YONO + AVANYA">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={adoption} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="m" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line dataKey="v" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3, fill: BRAND }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Charts row 2 */}
      <section className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Top customer issues" subtitle="Share of queries routed through AVANYA">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={issues} layout="vertical" margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
              <XAxis type="number" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="k" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} width={140} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="v" fill={BRAND} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Confidence score distribution" subtitle="% of customers per band (0–100)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={confidence} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="b" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                {confidence.map((_, i) => (
                  <Cell key={i} fill={i >= 3 ? SUCCESS : BRAND2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <ChartCard title="Customer satisfaction (CSAT)" subtitle="Out of 5 — post-interaction survey">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={csat} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SUCCESS} stopOpacity={0.3} />
                <stop offset="100%" stopColor={SUCCESS} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="m" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} domain={[3, 5]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area dataKey="v" stroke={SUCCESS} strokeWidth={2} fill="url(#g2)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #E5E7EB",
  borderRadius: 10,
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(28,79,163,0.08)",
};

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3">
        <div className="font-semibold text-foreground">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}