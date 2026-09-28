import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import Link from "next/link";

/** Elevación claymórfica en px (sombra oscura abajo-derecha + luz arriba-izquierda). */
export const clay = (elevation = 8): CSSProperties => ({ "--e": `${elevation}px` }) as CSSProperties;

interface CardProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/** Tarjeta "inflada" (KountaCard). Con `href` navega; con `onClick` es un botón. */
export function KountaCard({ children, href, onClick, className = "" }: CardProps) {
  const base = `clay block w-full rounded-clay bg-surface text-left ${className}`;
  if (href) {
    return (
      <Link href={href} className={`${base} transition-transform active:scale-[0.98]`} style={clay(8)}>
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} transition-transform active:scale-[0.98]`} style={clay(8)}>
        {children}
      </button>
    );
  }
  return (
    <div className={base} style={clay(8)}>
      {children}
    </div>
  );
}

/** Sección con borde fino (KountaSection). */
export function KountaSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`clay rounded-clay border border-line bg-surface ${className}`} style={clay(8)}>
      {children}
    </div>
  );
}

export function KountaPrimaryButton({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      style={clay(6)}
      className={`clay w-full rounded-clay bg-primary py-3.5 text-base font-semibold text-on-accent transition-transform active:scale-[0.98] disabled:bg-primary/40 ${className}`}
    >
      {children}
    </button>
  );
}

export function KountaHint({ children }: { children: ReactNode }) {
  return <p className="pt-1 text-[11px] leading-4 font-medium text-muted">{children}</p>;
}

/** Botón redondo "+"/"-" del selector de cantidad (FilledTonalIconButton del original). */
export function TonalButton({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`grid size-10 place-items-center rounded-full bg-secondary/35 text-primary transition-opacity active:opacity-80 disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}
