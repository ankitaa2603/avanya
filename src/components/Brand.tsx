import { Link } from "@tanstack/react-router";

export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[10px] bg-brand text-brand-foreground font-bold"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      aria-hidden
    >
      A
    </span>
  );
}

export function BrandLogo({ to = "/" as string }: { to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2.5 group">
      <BrandMark />
      <span className="flex flex-col leading-tight">
        <span className="font-semibold tracking-tight text-foreground">AVANYA</span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          A branch in your pocket
        </span>
      </span>
    </Link>
  );
}