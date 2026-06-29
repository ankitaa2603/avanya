import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard, MessageSquareText, FileDown, BarChart3, Calculator, Network, LogOut, Type,
} from "lucide-react";
import { BrandLogo } from "./Brand";
import { useStore } from "@/lib/store";

const NAV: { to: string; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/assistant", label: "AI Assistant", icon: MessageSquareText },
  { to: "/app/statement", label: "Statement", icon: FileDown },
  { to: "/app/admin", label: "Admin", icon: BarChart3 },
  { to: "/app/roi", label: "ROI", icon: Calculator },
  { to: "/app/architecture", label: "Architecture", icon: Network },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { persona, logout, seniorMode, setSeniorMode } = useStore();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function handleLogout() {
    logout();
    router.navigate({ to: "/" });
  }

  return (
    <div className={seniorMode ? "min-h-dvh bg-background text-[17px]" : "min-h-dvh bg-background"}>
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <BrandLogo to="/app" />
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors " +
                    (active
                      ? "bg-brand-soft text-brand"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted")
                  }
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSeniorMode(!seniorMode)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-pressed={seniorMode}
              title="Senior citizen mode: larger text"
            >
              <Type size={13} />
              {seniorMode ? "Senior: On" : "Senior Mode"}
            </button>
            {persona && (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="size-8 rounded-full bg-brand-soft text-brand font-semibold flex items-center justify-center text-sm">
                  {persona.name.charAt(0)}
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-sm font-medium text-foreground">{persona.name}</div>
                  <div className="text-[11px] text-muted-foreground">{persona.accountNo}</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={13} />
                  <span className="hidden lg:inline">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <nav className="md:hidden border-t border-border">
          <div className="container-page flex gap-1 overflow-x-auto py-2">
            {NAV.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium " +
                    (active ? "bg-brand-soft text-brand" : "text-muted-foreground")
                  }
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <main className="container-page py-8 animate-fade-up">{children}</main>
      <footer className="border-t border-border mt-12 py-6 text-center text-xs text-muted-foreground">
        AVANYA · Built for SBI Global FinTech Fest 2026 · Team Mavericks · Demo environment with simulated data
      </footer>
    </div>
  );
}