import {
  clampInt,
  defaultInitials,
  MAX_PLAYERS,
  normalizePlayerName,
  resizeInitials,
  sanitizeInitials,
} from "@/src/shared/game/players";
import {
  emptyRound,
  ensureTrailingEmptyRound,
  normalizeRounds,
  parseCellInput,
  sanitizeRounds,
  setCell,
  type Round,
} from "@/src/shared/game/rounds";

export const DIEZMIL_TARGET = 10_000;
export const DIEZMIL_ENTRY_THRESHOLD = 750;
export const MIN_DIEZMIL_PLAYERS = 2;
export const MAX_DIEZMIL_PLAYERS = MAX_PLAYERS;
export const DEFAULT_DIEZMIL_PLAYERS = 4;

export const ERROR_NOT_ENTERED = "No has llegado a 750, intentá de nuevo en la próxima ronda";
export const ERROR_OVER_TARGET = "Te pasaste de 10000 puntos";
export const ERROR_NEGATIVE = "Solo se permiten números positivos";

export interface DiezMilState {
  isConfigured: boolean;
  initials: string[];
  rounds: Round[];
  /** Índices de jugadores en el orden en que llegaron a 10.000. */
  placementOrder: number[];
}

export const initialDiezMil = (): DiezMilState => ({
  isConfigured: false,
  initials: [],
  rounds: [],
  placementOrder: [],
});

export function startDiezMil(count: number): DiezMilState {
  const n = clampInt(count, MIN_DIEZMIL_PLAYERS, MAX_DIEZMIL_PLAYERS);
  return { isConfigured: true, initials: defaultInitials(n), rounds: [emptyRound(n)], placementOrder: [] };
}

/** Un jugador "entra" cuando su primer valor positivo es de 750 o más. */
export function hasStarted(rounds: readonly Round[], player: number): boolean {
  const first = rounds.map((row) => row[player] ?? 0).find((v) => v > 0);
  return first !== undefined && first >= DIEZMIL_ENTRY_THRESHOLD;
}

export const totalOf = (rounds: readonly Round[], player: number): number =>
  hasStarted(rounds, player) ? rounds.reduce((sum, row) => sum + (row[player] ?? 0), 0) : 0;

export const hasWon = (rounds: readonly Round[], player: number): boolean =>
  hasStarted(rounds, player) && totalOf(rounds, player) === DIEZMIL_TARGET;

export const remainingOf = (rounds: readonly Round[], player: number): number =>
  Math.max(0, DIEZMIL_TARGET - totalOf(rounds, player));

/** Mantiene el orden de llegada de los que ya ganaron y suma a los nuevos ganadores al final. */
function syncPlacement(rounds: readonly Round[], players: number, order: readonly number[]): number[] {
  const kept = order.filter((p) => p < players && hasWon(rounds, p));
  for (let p = 0; p < players; p++) if (hasWon(rounds, p) && !kept.includes(p)) kept.push(p);
  return kept;
}

export interface CellResult {
  state: DiezMilState;
  error: string | null;
}

/** Confirma el valor de una celda. Devuelve el nuevo estado y, si corresponde, un mensaje de error. */
export function commitCell(state: DiezMilState, round: number, player: number, raw: string): CellResult {
  const parsed = parseCellInput(raw);
  if (!parsed.ok || (parsed.value !== null && parsed.value < 0) || raw.trim() === "-") {
    return { state, error: ERROR_NEGATIVE };
  }
  if (state.rounds[round]?.[player] === undefined) return { state, error: null };

  const { value } = parsed;
  let error: string | null = null;
  let rounds = setCell(state.rounds, round, player, value);

  // Primer valor positivo del jugador por debajo de 750: no entra, la celda queda en 0.
  const first = rounds.map((row) => row[player] ?? 0).findIndex((v) => v > 0);
  if (value !== null && value > 0 && first === round && value < DIEZMIL_ENTRY_THRESHOLD) {
    error = ERROR_NOT_ENTERED;
    rounds = setCell(state.rounds, round, player, 0);
  }

  if (hasStarted(rounds, player) && totalOf(rounds, player) > DIEZMIL_TARGET) {
    return { state, error: ERROR_OVER_TARGET };
  }

  rounds = ensureTrailingEmptyRound(rounds, state.initials.length);
  return {
    state: { ...state, rounds, placementOrder: syncPlacement(rounds, state.initials.length, state.placementOrder) },
    error,
  };
}

export function renamePlayer(state: DiezMilState, player: number, raw: string): DiezMilState {
  const name = normalizePlayerName(raw);
  if (!name || name === state.initials[player] || state.placementOrder.includes(player)) return state;
  return { ...state, initials: state.initials.map((n, i) => (i === player ? name : n)) };
}

export function setPlayerCount(state: DiezMilState, count: number): DiezMilState {
  const n = clampInt(count, MIN_DIEZMIL_PLAYERS, MAX_DIEZMIL_PLAYERS);
  if (n === state.initials.length) return state;
  const rounds = normalizeRounds(state.rounds, n);
  return {
    ...state,
    initials: resizeInitials(state.initials, n),
    rounds,
    placementOrder: syncPlacement(rounds, n, state.placementOrder),
  };
}

export function sanitizeDiezMil(raw: unknown): DiezMilState | null {
  const value = raw as Partial<DiezMilState> | null;
  if (!value?.isConfigured) return null;
  const initials = sanitizeInitials(value.initials, MIN_DIEZMIL_PLAYERS, MAX_DIEZMIL_PLAYERS);
  const rounds = initials && sanitizeRounds(value.rounds, initials.length);
  if (!initials || !rounds) return null;
  const order = Array.isArray(value.placementOrder)
    ? value.placementOrder.filter((p): p is number => Number.isInteger(p))
    : [];
  return { isConfigured: true, initials, rounds, placementOrder: syncPlacement(rounds, initials.length, order) };
}
