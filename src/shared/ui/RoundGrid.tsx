"use client";

import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { Round } from "@/src/shared/game/rounds";
import { GridLabel } from "./ScoreFields";

export interface ExtraRow {
  label: string;
  render: (player: number) => ReactNode;
}

interface Props {
  players: number;
  rounds: readonly Round[];
  headerLabel?: string;
  renderInitial: (player: number) => ReactNode;
  renderCell: (round: number, player: number) => ReactNode;
  /** Filas al final (Total, Faltan…). */
  extraRows?: ExtraRow[];
  /** Texto de ayuda debajo de la planilla. */
  children?: ReactNode;
}

/** Suelta el foco al tocar fuera de un campo (Safari no lo hace al tocar zonas no interactivas). */
export function blurOnOutsidePress(e: React.PointerEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest("input, button")) (document.activeElement as HTMLElement | null)?.blur();
}

/** Planilla por rondas compartida por Chin Chon, 10 mil y Comodín. */
export function RoundGrid({ players, rounds, headerLabel = "Ronda", renderInitial, renderCell, extraRows = [], children }: Props) {
  const style: CSSProperties = {
    gridTemplateColumns: `56px repeat(${players}, minmax(104px, 1fr))`,
    gridAutoRows: "52px",
    width: "max-content",
    minWidth: "100%",
  };

  return (
    <div className="min-h-0 flex-1 overflow-auto p-3" onPointerDownCapture={blurOnOutsidePress}>
      <div className="grid gap-2" style={style}>
        <GridLabel>{headerLabel}</GridLabel>
        {Array.from({ length: players }, (_, p) => (
          <div key={p}>{renderInitial(p)}</div>
        ))}

        {rounds.map((_, r) => (
          <Fragment key={r}>
            <GridLabel>{r + 1}</GridLabel>
            {Array.from({ length: players }, (_, p) => (
              <div key={p}>{renderCell(r, p)}</div>
            ))}
          </Fragment>
        ))}

        {extraRows.map((row) => (
          <Fragment key={row.label}>
            <GridLabel>{row.label}</GridLabel>
            {Array.from({ length: players }, (_, p) => (
              <div key={p}>{row.render(p)}</div>
            ))}
          </Fragment>
        ))}
      </div>
      {children}
    </div>
  );
}
