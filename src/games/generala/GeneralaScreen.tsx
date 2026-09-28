"use client";

import { Fragment, useState } from "react";
import { useKeepScreenAwake } from "@/src/shared/hooks/useKeepScreenAwake";
import { usePersistentGame } from "@/src/shared/hooks/usePersistentGame";
import { createGameStore } from "@/src/shared/persistence/gameStore";
import { clay } from "@/src/shared/ui/Clay";
import { ConfirmDialog } from "@/src/shared/ui/Dialogs";
import { GameTopBar, PlayerCountActions, TopBarButton } from "@/src/shared/ui/GameTopBar";
import { blurOnOutsidePress } from "@/src/shared/ui/RoundGrid";
import { GridLabel, GridTotalCell, PlayerInitialField } from "@/src/shared/ui/ScoreFields";
import {
  cycleCell,
  GENERALA_ROWS,
  initialGenerala,
  MAX_GENERALA_PLAYERS,
  MIN_GENERALA_PLAYERS,
  playerTotal,
  renamePlayer,
  sanitizeGenerala,
  setPlayerCount,
} from "./model";

const store = createGameStore({ key: "kounta:generala", version: 1, sanitize: sanitizeGenerala });

const ROW_HEIGHT = 44;
const ROW_GAP = 4;

export function GeneralaScreen() {
  const { state, update, reset } = usePersistentGame({ store, initial: initialGenerala });
  const [showTotals, setShowTotals] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [lastEdited, setLastEdited] = useState<{ player: number; row: number } | null>(null);
  useKeepScreenAwake(state);

  const players = state.initials.length;
  const rows = GENERALA_ROWS.length + 1 + (showTotals ? 1 : 0);

  const changeCount = (count: number) => {
    update((s) => setPlayerCount(s, count));
    setLastEdited((cell) => (cell && cell.player < count ? cell : null));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GameTopBar
        title="Generala"
        onReset={() => setConfirmReset(true)}
        actions={
          <>
            <PlayerCountActions
              count={players}
              min={MIN_GENERALA_PLAYERS}
              max={MAX_GENERALA_PLAYERS}
              onDecrease={() => changeCount(players - 1)}
              onIncrease={() => changeCount(players + 1)}
            />
            <TopBarButton
              label={showTotals ? "Ocultar totales" : "Mostrar totales"}
              icon={showTotals ? "visibilityOff" : "visibility"}
              onClick={() => setShowTotals((v) => !v)}
            />
          </>
        }
      />

      <div className="min-h-0 flex-1 overflow-auto px-2.5 py-1.5" onPointerDownCapture={blurOnOutsidePress}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `60px repeat(${players}, minmax(60px, 1fr))`,
            gridAutoRows: `minmax(${ROW_HEIGHT}px, 1fr)`,
            columnGap: 6,
            rowGap: ROW_GAP,
            width: "max-content",
            minWidth: "100%",
            height: "100%",
            minHeight: rows * ROW_HEIGHT + (rows - 1) * ROW_GAP,
          }}
        >
          <GridLabel>#</GridLabel>
          {state.initials.map((name, p) => (
            <PlayerInitialField key={p} label={`Jugador ${p + 1}`} value={name} onChange={(raw) => update((s) => renamePlayer(s, p, raw))} />
          ))}

          {GENERALA_ROWS.map((row, r) => (
            <Fragment key={row.label}>
              <GridLabel>
                <span title={row.name}>{row.label}</span>
              </GridLabel>
              {state.board.map((column, p) => (
                <ScoreCell
                  key={p}
                  value={column[r]}
                  highlighted={lastEdited?.player === p && lastEdited.row === r}
                  label={`${row.name}, jugador ${state.initials[p]}`}
                  onPress={() => {
                    update((s) => cycleCell(s, p, r));
                    setLastEdited({ player: p, row: r });
                  }}
                />
              ))}
            </Fragment>
          ))}

          {showTotals && (
            <Fragment>
              <GridLabel>Total</GridLabel>
              {state.board.map((_, p) => (
                <GridTotalCell key={p}>{playerTotal(state, p)}</GridTotalCell>
              ))}
            </Fragment>
          )}
        </div>

        {players <= MIN_GENERALA_PLAYERS && <p className="pt-2 text-center text-[11px] leading-4 font-medium text-muted">Mínimo de jugadores alcanzado</p>}
      </div>

      {confirmReset && (
        <ConfirmDialog
          title="¿Empezar una nueva planilla?"
          message="Se borran todos los puntajes cargados en Generala."
          confirmLabel="Reiniciar"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            reset();
            setLastEdited(null);
            setConfirmReset(false);
          }}
        />
      )}
    </div>
  );
}

function ScoreCell({ value, highlighted, label, onPress }: { value: number | null; highlighted: boolean; label: string; onPress: () => void }) {
  const text = value === null ? "-" : value === 0 ? "X" : String(value);
  const look = highlighted
    ? "border-2 border-primary bg-win-container font-semibold text-primary"
    : value === null
      ? "border border-line bg-empty font-normal text-muted"
      : "border border-line bg-surface font-semibold text-strong";

  return (
    <button
      type="button"
      aria-label={`${label}: ${text}`}
      onClick={onPress}
      style={clay(5)}
      className={`clay grid h-full w-full place-items-center rounded-clay-sm text-base transition-transform active:scale-95 ${look}`}
    >
      {text}
    </button>
  );
}
