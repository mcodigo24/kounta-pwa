"use client";

import { useState } from "react";
import { useKeepScreenAwake } from "@/src/shared/hooks/useKeepScreenAwake";
import { usePersistentGame } from "@/src/shared/hooks/usePersistentGame";
import { createGameStore } from "@/src/shared/persistence/gameStore";
import { KountaHint, KountaSection } from "@/src/shared/ui/Clay";
import { ConfirmDialog, TextInputDialog } from "@/src/shared/ui/Dialogs";
import { GameTopBar, TopBarButton } from "@/src/shared/ui/GameTopBar";
import { PlayerSetup } from "@/src/shared/ui/PlayerSetup";
import { RoundGrid } from "@/src/shared/ui/RoundGrid";
import { GridTotalCell, PlayerInitialField, SignedScoreField, UnsignedScoreField } from "@/src/shared/ui/ScoreFields";
import {
  addPlayer,
  DEFAULT_COMODIN_PLAYERS,
  DEFAULT_COMODIN_TITLE,
  initialComodin,
  MAX_COMODIN_PLAYERS,
  MAX_COMODIN_TITLE_LENGTH,
  MIN_COMODIN_PLAYERS,
  renamePlayer,
  sanitizeComodin,
  startComodin,
  totalOf,
  updateCell,
  updateTitle,
} from "./model";

const store = createGameStore({ key: "kounta:comodin", version: 1, sanitize: sanitizeComodin });

export function ComodinScreen() {
  const { state, update, reset } = usePersistentGame({ store, initial: initialComodin });
  const [confirmReset, setConfirmReset] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [showTotals, setShowTotals] = useState(false);
  useKeepScreenAwake(state.rounds);

  if (!state.isConfigured) {
    return <ComodinSetup onStart={(count, negatives, title) => update(() => startComodin(count, negatives, title))} />;
  }

  const players = state.initials.length;
  const Field = state.allowNegatives ? SignedScoreField : UnsignedScoreField;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GameTopBar
        title={state.title}
        onReset={() => setConfirmReset(true)}
        actions={
          <>
            <TopBarButton label="Editar nombre del juego" icon="edit" onClick={() => setEditTitle(true)} />
            <TopBarButton label="Agregar equipo" icon="add" disabled={players >= MAX_COMODIN_PLAYERS} onClick={() => update(addPlayer)} />
            <TopBarButton
              label={showTotals ? "Ocultar totales" : "Mostrar totales"}
              icon={showTotals ? "visibilityOff" : "visibility"}
              onClick={() => setShowTotals((v) => !v)}
            />
          </>
        }
      />

      <RoundGrid
        players={players}
        rounds={state.rounds}
        renderInitial={(p) => (
          <PlayerInitialField label={`Equipo ${p + 1}`} value={state.initials[p]} onChange={(raw) => update((s) => renamePlayer(s, p, raw))} />
        )}
        renderCell={(r, p) => (
          <Field
            label={`Ronda ${r + 1}, equipo ${state.initials[p]}`}
            value={state.rounds[r][p]}
            onChange={(raw) => update((s) => updateCell(s, r, p, raw))}
          />
        )}
        extraRows={showTotals ? [{ label: "Total", render: (p) => <GridTotalCell>{totalOf(state, p)}</GridTotalCell> }] : []}
      >
        <div className="max-w-xl pt-3">
          <KountaHint>
            {state.allowNegatives ? "Tocá el +/- junto al número para ingresar valores negativos." : "Esta planilla solo acepta valores positivos."}
          </KountaHint>
        </div>
      </RoundGrid>

      {editTitle && (
        <TextInputDialog
          title="Nombre del juego"
          initialValue={state.title}
          placeholder={DEFAULT_COMODIN_TITLE}
          maxLength={MAX_COMODIN_TITLE_LENGTH}
          onCancel={() => setEditTitle(false)}
          onSave={(value) => {
            update((s) => updateTitle(s, value));
            setEditTitle(false);
          }}
        />
      )}

      {confirmReset && (
        <ConfirmDialog
          title="¿Empezar una nueva partida?"
          message="Se borrarán todos los puntajes de Comodín."
          confirmLabel="Reiniciar"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            reset();
            setShowTotals(false);
            setConfirmReset(false);
          }}
        />
      )}
    </div>
  );
}

function ComodinSetup({ onStart }: { onStart: (count: number, allowNegatives: boolean, title: string) => void }) {
  const [allowNegatives, setAllowNegatives] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <PlayerSetup
      title="Comodín"
      noun="equipos"
      min={MIN_COMODIN_PLAYERS}
      max={MAX_COMODIN_PLAYERS}
      defaultCount={DEFAULT_COMODIN_PLAYERS}
      onStart={(count) => onStart(count, allowNegatives, title)}
    >
      <KountaSection className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-base leading-6 font-semibold">Aceptar valores negativos</p>
          <p className="text-xs leading-4 text-muted">Útil para juegos donde se restan puntos</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={allowNegatives}
          aria-label="Aceptar valores negativos"
          onClick={() => setAllowNegatives((v) => !v)}
          className={`relative h-8 w-13 shrink-0 rounded-full transition-colors ${allowNegatives ? "bg-primary" : "bg-empty"}`}
        >
          <span
            className={`absolute top-1 size-6 rounded-full transition-all ${allowNegatives ? "left-6 bg-on-accent" : "left-1 bg-muted"}`}
          />
        </button>
      </KountaSection>

      <label className="block">
        <span className="mb-1 block text-xs text-muted">Nombre del juego (opcional)</span>
        <input
          value={title}
          maxLength={MAX_COMODIN_TITLE_LENGTH}
          placeholder={DEFAULT_COMODIN_TITLE}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-line-focus bg-transparent px-3 py-3.5 text-base text-strong outline-none placeholder:text-muted focus:border-primary"
        />
      </label>
    </PlayerSetup>
  );
}
