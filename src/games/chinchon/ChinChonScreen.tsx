"use client";

import { useState } from "react";
import { useKeepScreenAwake } from "@/src/shared/hooks/useKeepScreenAwake";
import { usePersistentGame } from "@/src/shared/hooks/usePersistentGame";
import { createGameStore } from "@/src/shared/persistence/gameStore";
import { KountaHint } from "@/src/shared/ui/Clay";
import { ConfirmDialog } from "@/src/shared/ui/Dialogs";
import { GameTopBar, TopBarButton } from "@/src/shared/ui/GameTopBar";
import { PlayerSetup } from "@/src/shared/ui/PlayerSetup";
import { RoundGrid } from "@/src/shared/ui/RoundGrid";
import { GridTotalCell, PlayerInitialField, SignedScoreField } from "@/src/shared/ui/ScoreFields";
import {
  addPlayer,
  DEFAULT_CHINCHON_PLAYERS,
  initialChinChon,
  MAX_CHINCHON_PLAYERS,
  MIN_CHINCHON_PLAYERS,
  renamePlayer,
  sanitizeChinChon,
  standings,
  startChinChon,
  updateCell,
} from "./model";

const store = createGameStore({ key: "kounta:chinchon", version: 1, sanitize: sanitizeChinChon });

export function ChinChonScreen() {
  const { state, update, reset } = usePersistentGame({ store, initial: initialChinChon });
  const [confirmReset, setConfirmReset] = useState(false);
  useKeepScreenAwake(state.rounds);

  if (!state.isConfigured) {
    return (
      <PlayerSetup
        title="Chin Chon"
        min={MIN_CHINCHON_PLAYERS}
        max={MAX_CHINCHON_PLAYERS}
        defaultCount={DEFAULT_CHINCHON_PLAYERS}
        onStart={(count) => update(() => startChinChon(count))}
      />
    );
  }

  const players = state.initials.length;
  const results = standings(state);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GameTopBar
        title="Chin Chon"
        onReset={() => setConfirmReset(true)}
        actions={<TopBarButton label="Agregar jugador" icon="add" disabled={players >= MAX_CHINCHON_PLAYERS} onClick={() => update(addPlayer)} />}
      />

      <RoundGrid
        players={players}
        rounds={state.rounds}
        renderInitial={(p) => (
          <PlayerInitialField
            label={`Jugador ${p + 1}`}
            value={state.initials[p]}
            tone={results[p].lost ? "lost" : "default"}
            onChange={(raw) => update((s) => renamePlayer(s, p, raw))}
          />
        )}
        renderCell={(r, p) => (
          <SignedScoreField
            label={`Ronda ${r + 1}, jugador ${state.initials[p]}`}
            value={state.rounds[r][p]}
            tone={results[p].lost ? "lost" : "default"}
            onChange={(raw) => update((s) => updateCell(s, r, p, raw))}
          />
        )}
        extraRows={[{ label: "Total", render: (p) => <GridTotalCell tone={results[p].lost ? "lost" : "variant"}>{results[p].total}</GridTotalCell> }]}
      >
        <div className="max-w-xl pt-3">
          <KountaHint>
            Al llegar a 100 o más, la columna se marca en rojo. El próximo valor ingresado reinicia el conteo desde ese número. Tocá el +/- junto al número
            para ingresar valores negativos.
          </KountaHint>
        </div>
      </RoundGrid>

      {confirmReset && (
        <ConfirmDialog
          title="¿Empezar una nueva partida?"
          message="Se borrarán todos los puntajes de Chin Chon."
          confirmLabel="Reiniciar"
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
