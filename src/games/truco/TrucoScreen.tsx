"use client";

import { useState } from "react";
import { useKeepScreenAwake } from "@/src/shared/hooks/useKeepScreenAwake";
import { useIsLandscape } from "@/src/shared/hooks/useMediaQuery";
import { usePersistentGame } from "@/src/shared/hooks/usePersistentGame";
import { createGameStore } from "@/src/shared/persistence/gameStore";
import { ConfirmDialog } from "@/src/shared/ui/Dialogs";
import { GameTopBar } from "@/src/shared/ui/GameTopBar";
import { Icon } from "@/src/shared/ui/Icon";
import { adjustScore, initialTruco, MAX_SCORE, MIN_SCORE, sanitizeTruco } from "./model";

const store = createGameStore({ key: "kounta:truco", version: 1, sanitize: sanitizeTruco });

export function TrucoScreen() {
  const { state, update, reset } = usePersistentGame({ store, initial: initialTruco });
  const [confirmReset, setConfirmReset] = useState(false);
  const landscape = useIsLandscape();
  useKeepScreenAwake(state);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GameTopBar
        title="Truco"
        actions={
          <button
            type="button"
            aria-label="Nueva partida"
            onClick={() => setConfirmReset(true)}
            className="mr-1 grid size-10 place-items-center rounded-full bg-variant text-strong active:opacity-80"
          >
            <Icon name="refresh" size={22} />
          </button>
        }
      />

      <div className={`flex min-h-0 flex-1 ${landscape ? "flex-row" : "flex-col"}`}>
        <TeamPanel name="Nosotros" score={state.nosotros} onAdjust={(d) => update((s) => adjustScore(s, "nosotros", d))} />
        <div className={landscape ? "w-px bg-line" : "h-px bg-line"} />
        <TeamPanel name="Ellos" score={state.ellos} onAdjust={(d) => update((s) => adjustScore(s, "ellos", d))} />
      </div>

      {confirmReset && (
        <ConfirmDialog
          title="¿Empezar de cero?"
          message="Se borrarán los puntajes guardados en este dispositivo."
          confirmLabel="Sí, reiniciar"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            reset();
            setConfirmReset(false);
          }}
        />
      )}
    </div>
  );
}

function TeamPanel({ name, score, onAdjust }: { name: string; score: number; onAdjust: (delta: number) => void }) {
  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-4">
      <h2 className="text-xl leading-7 font-medium text-strong/75">{name}</h2>
      <p className="mt-3 text-[96px] leading-none font-bold text-strong tabular-nums" aria-live="polite" aria-label={`${name}: ${score}`}>
        {score}
      </p>
      <div className="mt-7 flex gap-8">
        <button
          type="button"
          aria-label="Restar un punto"
          disabled={score <= MIN_SCORE}
          onClick={() => onAdjust(-1)}
          className="grid size-[72px] place-items-center rounded-full bg-surface text-primary transition-transform active:scale-95 disabled:bg-surface/50 disabled:text-primary/35"
        >
          <Icon name="remove" size={32} />
        </button>
        <button
          type="button"
          aria-label="Sumar un punto"
          disabled={score >= MAX_SCORE}
          onClick={() => onAdjust(1)}
          className="grid size-[72px] place-items-center rounded-full bg-secondary text-on-accent transition-transform active:scale-95 disabled:bg-surface/50 disabled:text-primary/35"
        >
          <Icon name="add" size={32} />
        </button>
      </div>
    </section>
  );
}
