"use client";

import { useState, type ReactNode } from "react";
import { GameTopBar } from "./GameTopBar";
import { KountaPrimaryButton, KountaSection, TonalButton } from "./Clay";
import { Icon } from "./Icon";

interface Props {
  title: string;
  /** "jugadores" o "equipos". */
  noun?: string;
  heading?: string;
  min: number;
  max: number;
  defaultCount: number;
  onStart: (count: number) => void;
  /** Opciones extra debajo del selector (Comodín). */
  children?: ReactNode;
}

/** Pantalla previa a la partida: cantidad de jugadores y "Comenzar partida". */
export function PlayerSetup({ title, noun = "jugadores", heading, min, max, defaultCount, onStart, children }: Props) {
  const [count, setCount] = useState(defaultCount);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GameTopBar title={title} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-6 px-7 py-8">
          <div>
            <h2 className="text-2xl leading-8 font-bold">{heading ?? `Cantidad de ${noun}`}</h2>
            <p className="mt-1 text-sm leading-5 text-muted">
              Elegí entre {min} y {max} {noun}
            </p>
          </div>

          <KountaSection className="flex items-center justify-evenly px-7 py-6">
            <TonalButton aria-label={`Menos ${noun}`} className="size-14" disabled={count <= min} onClick={() => setCount((c) => c - 1)}>
              <Icon name="remove" size={28} />
            </TonalButton>
            <span className="min-w-14 text-center text-4xl leading-11 font-bold text-primary">{count}</span>
            <TonalButton aria-label={`Más ${noun}`} className="size-14" disabled={count >= max} onClick={() => setCount((c) => c + 1)}>
              <Icon name="add" size={28} />
            </TonalButton>
          </KountaSection>

          {children}

          <KountaPrimaryButton onClick={() => onStart(count)}>Comenzar partida</KountaPrimaryButton>
        </div>
      </div>
    </div>
  );
}
