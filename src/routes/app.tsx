import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { persona } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!persona) router.navigate({ to: "/login" });
  }, [persona, router]);

  if (!persona) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-muted-foreground text-sm">
        Redirecting to sign in…
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}