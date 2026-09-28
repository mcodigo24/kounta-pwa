"use client";

import { useState } from "react";
import { useKeepScreenAwake } from "@/src/shared/hooks/useKeepScreenAwake";
import { usePersistentGame } from "@/src/shared/hooks/usePersistentGame";
import { createGameStore } from "@/src/shared/persistence/gameStore";
import { KountaHint } from "@/src/shared/ui/Clay";
import { ConfirmDialog } from "@/src/shared/ui/Dialogs";
import { GameTopBar, PlayerCountActions } from "@/src/shared/ui/GameTopBar";
import { PlayerSetup } from "@/src/shared/ui/PlayerSetup";
import { RoundGrid } from "@/src/shared/ui/RoundGrid";
import { GridTotalCell, PlayerInitialField, UnsignedScoreField } from "@/src/shared/ui/ScoreFields";
import {
  commitCell,
  DEFAULT_DIEZMIL_PLAYERS,
  hasStarted,
  hasWon,
  initialDiezMil,
  MAX_DIEZMIL_PLAYERS,
  MIN_DIEZMIL_PLAYERS,
  remainingOf,
  renamePlayer,
  sanitizeDiezMil,
  setPlayerCount,
  startDiezMil,
  totalOf,
} from "./model";

const store = createGameStore({ key: "kounta:diezmil", version: 1, sanitize: sanitizeDiezMil });

export function DiezMilScreen() {
  const { state, update, reset } = usePersistentGame({ store, initial: initialDiezMil });
  const [confirmReset, setConfirmReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useKeepScreenAwake(state.rounds);

  if (!state.isConfigured) {
    return (
      <PlayerSetup
        title="10 mil"
        min={MIN_DIEZMIL_PLAYERS}
        max={MAX_DIEZMIL_PLAYERS}
        defaultCount={DEFAULT_DIEZMIL_PLAYERS}
        onStart={(count) => update(() => startDiezMil(count))}
      />
    );
  }

  const players = state.initials.length;
  const { rounds } = state;

  const commit = (round: number, player: number, raw: string) => {
    // update() aplica la función sobre el último estado; el error se calcula sobre ese mismo estado.
    let message: string | null = null;
    update((s) => {
      const result = commitCell(s, round, player, raw);
      message = result.error;
      return result.state;
    });
    setError(message);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GameTopBar
        title="10 mil"
        onReset={() => setConfirmReset(true)}
        actions={
          <PlayerCountActions
            count={players}
            min={MIN_DIEZMIL_PLAYERS}
            max={MAX_DIEZMIL_PLAYERS}
            onDecrease={() => update((s) => setPlayerCount(s, players - 1))}
            onIncrease={() => update((s) => setPlayerCount(s, players + 1))}
          />
        }
      />

      {error && (
        <p role="alert" className="px-4 pt-2 text-xs leading-4 font-medium text-lost">
          {error}
        </p>
      )}

      <RoundGrid
        players={players}
        rounds={rounds}
        renderInitial={(p) => {
          const place = state.placementOrder.indexOf(p);
          const started = hasStarted(rounds, p);
          return (
            <PlayerInitialField
              label={`Jugador ${p + 1}`}
              value={place >= 0 ? `${state.initials[p]} #${place + 1}` : state.initials[p]}
              readOnly={place >= 0}
              tone={started || hasWon(rounds, p) ? "win" : "default"}
              onChange={(raw) => update((s) => renamePlayer(s, p, raw))}
            />
          );
        }}
        renderCell={(r, p) => (
          <UnsignedScoreField
            label={`Ronda ${r + 1}, jugador ${state.initials[p]}`}
            value={rounds[r][p]}
            tone={hasWon(rounds, p) ? "win" : hasStarted(rounds, p) ? "winSoft" : "default"}
            onCommit={(raw) => commit(r, p, raw)}
          />
        )}
        extraRows={[
          { label: "Total", render: (p) => <GridTotalCell tone={hasWon(rounds, p) ? "win" : "variant"}>{totalOf(rounds, p)}</GridTotalCell> },
          { label: "Faltan", render: (p) => <GridTotalCell tone={hasWon(rounds, p) ? "win" : "variant"}>{remainingOf(rounds, p)}</GridTotalCell> },
        ]}
      >
        <div className="max-w-xl pt-3">
          <KountaHint>
            La primera casilla debe ser de 750 o más para empezar. Las casillas vacías cuentan como 0. Hay que llegar justo a 10000.
          </KountaHint>
        </div>
      </RoundGrid>

      {confirmReset && (
        <ConfirmDialog
          title="¿Empezar una nueva partida?"
          message="Se borrarán todos los puntajes de 10 mil."
          confirmLabel="Reiniciar"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            reset();
            setError(null);
            setConfirmReset(false);
          }}
        />
      )}
    </div>
  );
}
