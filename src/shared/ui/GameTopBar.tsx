"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useIsLandscape } from "@/src/shared/hooks/useMediaQuery";
import { Icon } from "./Icon";
import { TonalButton } from "./Clay";

const iconButton =
  "grid size-12 shrink-0 place-items-center rounded-full text-strong transition-colors active:bg-white/10";

interface Props {
  title: string;
  onReset?: () => void;
  /** Acciones extra antes del botón de nueva partida. */
  actions?: ReactNode;
}

/** Barra superior: volver al inicio, título, acciones y (si hay `onReset`) "Nueva partida". */
export function GameTopBar({ title, onReset, actions }: Props) {
  const compact = useIsLandscape();
  return (
    <header
      className="flex shrink-0 items-center gap-1 bg-background px-1 pl-[max(0.25rem,env(safe-area-inset-left))] pr-[max(0.25rem,env(safe-area-inset-right))] pt-[env(safe-area-inset-top)]"
      style={{ minHeight: compact ? "44px" : "64px" }}
    >
      <Link href="/app" aria-label="Volver" className={iconButton}>
        <Icon name="back" />
      </Link>
      <h1 className="min-w-0 flex-1 truncate pl-1 text-xl leading-7 font-semibold">{title}</h1>
      {actions}
      {onReset && (
        <button type="button" aria-label="Nueva partida" onClick={onReset} className={iconButton}>
          <Icon name="refresh" />
        </button>
      )}
    </header>
  );
}

export function TopBarButton({ label, icon, onClick, disabled }: { label: string; icon: Parameters<typeof Icon>[0]["name"]; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className={`${iconButton} disabled:opacity-40`}>
      <Icon name={icon} />
    </button>
  );
}

/** "-" [n] "+" para cambiar la cantidad de jugadores. */
export function PlayerCountActions({
  count,
  min,
  max,
  onDecrease,
  onIncrease,
}: {
  count: number;
  min: number;
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex items-center">
      <TonalButton aria-label="Menos jugadores" onClick={onDecrease} disabled={count <= min}>
        <Icon name="remove" size={20} />
      </TonalButton>
      <span className="px-1.5 text-base font-semibold">{count}</span>
      <TonalButton aria-label="Más jugadores" onClick={onIncrease} disabled={count >= max}>
        <Icon name="add" size={20} />
      </TonalButton>
    </div>
  );
}
