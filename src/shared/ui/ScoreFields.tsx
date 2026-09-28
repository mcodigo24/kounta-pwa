"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { normalizePlayerName } from "@/src/shared/game/players";
import { clay } from "./Clay";

/** Colores de celda: fondo + texto. */
export type Tone = "default" | "lost" | "win" | "winSoft";

const TONES: Record<Tone, string> = {
  default: "bg-surface text-strong",
  lost: "bg-lost-container text-lost",
  win: "bg-win-container text-primary",
  winSoft: "bg-win-container/35 text-primary",
};

const box = "clay h-full w-full rounded-clay-sm border";

export function GridLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      style={clay(4)}
      className={`${box} grid place-items-center border-line bg-variant px-1 text-base font-semibold text-strong ${className}`}
    >
      {children}
    </div>
  );
}

/** Celda de total / faltan: como GridLabel pero en negrita y más elevada. */
export function GridTotalCell({ children, tone = "variant" }: { children: ReactNode; tone?: "variant" | "lost" | "win" }) {
  const colors = { variant: "bg-variant text-strong", lost: "bg-lost-container text-lost", win: "bg-win-container text-primary" }[tone];
  return (
    <div style={clay(6)} className={`${box} grid place-items-center border-line px-1 text-base font-bold ${colors}`}>
      {children}
    </div>
  );
}

interface InitialProps {
  value: string;
  onChange: (raw: string) => void;
  readOnly?: boolean;
  tone?: "default" | "lost" | "win";
  label: string;
}

/**
 * Nombre de jugador (máx. 3, A-Z/0-9). Al enfocar se vacía para escribir de cero; si queda
 * vacío al salir, vuelve el nombre anterior.
 */
export function PlayerInitialField({ value, onChange, readOnly, tone = "default", label }: InitialProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? value;
  const scale = shown.length <= 1 ? 1 : shown.length === 2 ? 0.85 : 0.7;
  const color = { default: "text-strong", lost: "text-lost", win: "text-primary" }[tone];
  const border = draft === null ? "border-line" : "border-line-focus";

  return (
    <input
      aria-label={label}
      value={shown}
      readOnly={readOnly}
      autoCapitalize="characters"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      enterKeyHint="done"
      style={{ ...clay(5), fontSize: `${16 * scale}px` } as CSSProperties}
      onFocus={() => !readOnly && setDraft("")}
      onBlur={() => setDraft(null)}
      onChange={(e) => {
        const name = normalizePlayerName(e.target.value);
        setDraft(name);
        if (name) onChange(name);
      }}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      className={`clay h-full w-full min-w-0 rounded-clay-sm border ${border} bg-surface px-1 text-center font-bold outline-none ${color}`}
    />
  );
}

interface ScoreProps {
  value: number | null;
  tone?: Tone;
  label: string;
  /** Cada tecla (planillas sin validación previa). */
  onChange?: (raw: string) => void;
  /** Al confirmar con Enter o al salir de la celda. */
  onCommit?: (raw: string) => void;
}

const digitsOnly = (raw: string) => raw.replace(/\D/g, "");
const toText = (value: number | null) => (value === null ? "" : String(value));

const inputClass = "h-full min-w-0 flex-1 bg-transparent text-center text-base font-medium outline-none";

/** Puntaje con signo: botón +/- a la izquierda (los teclados numéricos no tienen "-"). */
export function SignedScoreField({ value, tone = "default", label, onChange, onCommit }: ScoreProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? toText(value);
  const negative = text.startsWith("-");
  const digits = digitsOnly(text);

  const apply = (next: string) => {
    setDraft(next);
    onChange?.(next);
  };

  return (
    <div
      style={clay(5)}
      className={`clay flex h-full w-full items-center rounded-clay-sm border ${draft === null ? "border-line" : "border-line-focus"} ${TONES[tone]}`}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={negative ? "Cambiar a positivo" : "Cambiar a negativo"}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const next = `${negative ? "" : "-"}${digits}`;
          apply(next);
          onCommit?.(next);
        }}
        className="grid size-7 shrink-0 place-items-center rounded-full text-base font-bold"
      >
        {negative ? "-" : "+"}
      </button>
      <input
        aria-label={label}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        enterKeyHint="done"
        value={digits}
        onFocus={(e) => {
          setDraft(toText(value));
          e.currentTarget.select();
        }}
        onBlur={() => {
          if (draft !== null && draft !== toText(value)) onCommit?.(draft);
          setDraft(null);
        }}
        onChange={(e) => apply(`${negative ? "-" : ""}${digitsOnly(e.target.value)}`)}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        className={inputClass}
      />
      <span className="w-7 shrink-0" />
    </div>
  );
}

/** Puntaje sin signo (solo dígitos). */
export function UnsignedScoreField({ value, tone = "default", label, onChange, onCommit }: ScoreProps) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <div
      style={clay(5)}
      className={`clay flex h-full w-full items-center rounded-clay-sm border ${draft === null ? "border-line" : "border-line-focus"} ${TONES[tone]}`}
    >
      <input
        aria-label={label}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        enterKeyHint="done"
        value={draft ?? toText(value)}
        onFocus={(e) => {
          setDraft(toText(value));
          e.currentTarget.select();
        }}
        onBlur={() => {
          if (draft !== null && draft !== toText(value)) onCommit?.(draft);
          setDraft(null);
        }}
        onChange={(e) => {
          const next = digitsOnly(e.target.value);
          setDraft(next);
          onChange?.(next);
        }}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        className={inputClass}
      />
    </div>
  );
}
