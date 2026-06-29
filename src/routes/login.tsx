import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/Brand";
import { PERSONAS } from "@/lib/personas";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · AVANYA" },
      { name: "description", content: "Demo login as one of three SBI customer personas. No OTP, no registration." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const { login, demoMode } = useStore();
  const [pending, setPending] = useState<string | null>(null);
  const fired = useRef(false);

  function signIn(id: (typeof PERSONAS)[number]["id"]) {
    setPending(id);
    login(id);
    setTimeout(() => router.navigate({ to: "/app" }), 500);
  }

  useEffect(() => {
    if (demoMode && !fired.current) {
      fired.current = true;
      const t = setTimeout(() => signIn("shanti"), 900);
      return () => clearTimeout(t);
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container-page h-16 flex items-center justify-between">
          <BrandLogo />
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back home</Link>
        </div>
      </header>

      <main className="container-page py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">Demo environment</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            Choose a customer to experience AVANYA
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Three preloaded personas. One-tap sign in — no OTP, no registration. All data is simulated.
          </p>
          {demoMode && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs text-brand font-medium">
              <span className="size-1.5 rounded-full bg-brand animate-pulse" />
              Judge Demo mode — signing in as Shanti Devi…
            </div>
          )}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {PERSONAS.map((p) => {
            const isPending = pending === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => signIn(p.id)}
                disabled={pending !== null}
                className={
                  "group text-left rounded-2xl border bg-card p-6 transition-all " +
                  (isPending
                    ? "border-brand ring-2 ring-brand/30 shadow-elevated"
                    : "border-border hover:border-brand/40 hover:shadow-card disabled:opacity-60")
                }
              >
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-brand-soft text-brand font-semibold text-lg flex items-center justify-center">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">Age {p.age}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.tagline}</p>
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{p.accountNo}</span>
                  <span className={"font-medium " + (isPending ? "text-brand" : "text-foreground group-hover:text-brand")}>
                    {isPending ? "Signing in…" : "Sign in →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          By continuing you agree this is a demo environment. AVANYA never asks for OTP, PIN, CVV, or passwords.
        </p>
      </main>
    </div>
  );
}