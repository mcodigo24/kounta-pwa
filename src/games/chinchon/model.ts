import {
  clampInt,
  defaultInitials,
  MAX_PLAYERS,
  nextUnusedLetter,
  normalizePlayerName,
  sanitizeInitials,
} from "@/src/shared/game/players";
import {
  emptyRound,
  ensureTrailingEmptyRound,
  parseCellInput,
  sanitizeRounds,
  setCell,
  type Round,
} from "@/src/shared/game/rounds";

export const CHINCHON_LOSE_THRESHOLD = 100;
export const MIN_CHINCHON_PLAYERS = 2;
export const MAX_CHINCHON_PLAYERS = MAX_PLAYERS;
export const DEFAULT_CHINCHON_PLAYERS = 4;

export interface ChinChonState {
  isConfigured: boolean;
  initials: string[];
  rounds: Round[];
}

export const initialChinChon = (): ChinChonState => ({ isConfigured: false, initials: [], rounds: [] });

export function startChinChon(count: number): ChinChonState {
  const n = clampInt(count, MIN_CHINCHON_PLAYERS, MAX_CHINCHON_PLAYERS);
  return { isConfigured: true, initials: defaultInitials(n), rounds: [emptyRound(n)] };
}

export interface PlayerStanding {
  total: number;
  lost: boolean;
  /** Ronda desde la que cuenta el total actual (0 salvo que haya reingresado tras pasarse). */
  segmentStart: number;
}

/**
 * Total del jugador. Al llegar a 100+ queda "perdido"; el próximo valor cargado en una ronda
 * posterior reinicia el conteo desde ese número. Se deriva de las rondas, así editar o borrar
 * celdas siempre da un resultado consistente.
 */
export function analyzePlayer(rounds: readonly Round[], player: number): PlayerStanding {
  let segmentStart = 0;
  let total = 0;
  let bustRound = -1;
  rounds.forEach((row, r) => {
    const value = row[player] ?? null;
    if (bustRound >= 0 && value !== null) {
      segmentStart = r;
      total = 0;
      bustRound = -1;
    }
    total += value ?? 0;
    if (bustRound < 0 && total >= CHINCHON_LOSE_THRESHOLD) bustRound = r;
  });
  return { total, lost: bustRound >= 0, segmentStart };
}

export const standings = (state: ChinChonState): PlayerStanding[] =>
  state.initials.map((_, p) => analyzePlayer(state.rounds, p));

export function updateCell(state: ChinChonState, round: number, player: number, raw: string): ChinChonState {
  const parsed = parseCellInput(raw);
  if (!parsed.ok || state.rounds[round]?.[player] === undefined) return state;
  if (state.rounds[round][player] === parsed.value) return state;
  const rounds = ensureTrailingEmptyRound(setCell(state.rounds, round, player, parsed.value), state.initials.length);
  return { ...state, rounds };
}

export function renamePlayer(state: ChinChonState, player: number, raw: string): ChinChonState {
  const name = normalizePlayerName(raw);
  if (!name || name === state.initials[player]) return state;
  return { ...state, initials: state.initials.map((n, i) => (i === player ? name : n)) };
}

/**
 * Suma un jugador. Arranca con el mayor total entre quienes siguen en juego (0 si todos se
 * pasaron) en la ronda actual y con 0 en las anteriores.
 */
export function addPlayer(state: ChinChonState): ChinChonState {
  if (state.initials.length >= MAX_CHINCHON_PLAYERS) return state;
  const alive = standings(state).filter((s) => !s.lost).map((s) => s.total);
  const seed = alive.length ? Math.max(...alive) : 0;
  const lastIndex = state.rounds.length - 1;
  const rounds = state.rounds.map((row, r) => [...row, r === lastIndex ? seed : 0]);
  const initials = [...state.initials, nextUnusedLetter(state.initials)];
  return { ...state, initials, rounds: ensureTrailingEmptyRound(rounds, initials.length) };
}

export function sanitizeChinChon(raw: unknown): ChinChonState | null {
  const value = raw as Partial<ChinChonState> | null;
  if (!value?.isConfigured) return null;
  const initials = sanitizeInitials(value.initials, MIN_CHINCHON_PLAYERS, MAX_CHINCHON_PLAYERS);
  const rounds = initials && sanitizeRounds(value.rounds, initials.length);
  return initials && rounds ? { isConfigured: true, initials, rounds } : null;
}
