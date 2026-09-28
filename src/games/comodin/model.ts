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

export const MIN_COMODIN_PLAYERS = 1;
export const MAX_COMODIN_PLAYERS = MAX_PLAYERS;
export const DEFAULT_COMODIN_PLAYERS = 2;
export const DEFAULT_COMODIN_TITLE = "Comodín";
export const MAX_COMODIN_TITLE_LENGTH = 40;

export interface ComodinState {
  isConfigured: boolean;
  initials: string[];
  rounds: Round[];
  allowNegatives: boolean;
  title: string;
}

export const initialComodin = (): ComodinState => ({
  isConfigured: false,
  initials: [],
  rounds: [],
  allowNegatives: false,
  title: DEFAULT_COMODIN_TITLE,
});

export function sanitizeTitle(raw: string): string {
  return raw.trim().slice(0, MAX_COMODIN_TITLE_LENGTH).trim() || DEFAULT_COMODIN_TITLE;
}

export function startComodin(count: number, allowNegatives: boolean, title: string): ComodinState {
  const n = clampInt(count, MIN_COMODIN_PLAYERS, MAX_COMODIN_PLAYERS);
  return {
    isConfigured: true,
    initials: defaultInitials(n),
    rounds: [emptyRound(n)],
    allowNegatives,
    title: sanitizeTitle(title),
  };
}

export function updateCell(state: ComodinState, round: number, player: number, raw: string): ComodinState {
  const parsed = parseCellInput(raw);
  if (!parsed.ok || state.rounds[round]?.[player] === undefined) return state;
  if (!state.allowNegatives && (parsed.value ?? 0) < 0) return state;
  if (state.rounds[round][player] === parsed.value) return state;
  const rounds = ensureTrailingEmptyRound(setCell(state.rounds, round, player, parsed.value), state.initials.length);
  return { ...state, rounds };
}

export function renamePlayer(state: ComodinState, player: number, raw: string): ComodinState {
  const name = normalizePlayerName(raw);
  if (!name || name === state.initials[player]) return state;
  return { ...state, initials: state.initials.map((n, i) => (i === player ? name : n)) };
}

export function addPlayer(state: ComodinState): ComodinState {
  if (state.initials.length >= MAX_COMODIN_PLAYERS) return state;
  const initials = [...state.initials, nextUnusedLetter(state.initials)];
  return { ...state, initials, rounds: state.rounds.map((row) => [...row, null]) };
}

export function updateTitle(state: ComodinState, raw: string): ComodinState {
  const title = sanitizeTitle(raw);
  return title === state.title ? state : { ...state, title };
}

export const totalOf = (state: ComodinState, player: number): number =>
  state.rounds.reduce((sum, row) => sum + (row[player] ?? 0), 0);

export function sanitizeComodin(raw: unknown): ComodinState | null {
  const value = raw as Partial<ComodinState> | null;
  if (!value?.isConfigured) return null;
  const initials = sanitizeInitials(value.initials, MIN_COMODIN_PLAYERS, MAX_COMODIN_PLAYERS);
  const rounds = initials && sanitizeRounds(value.rounds, initials.length);
  if (!initials || !rounds) return null;
  return {
    isConfigured: true,
    initials,
    rounds,
    allowNegatives: value.allowNegatives === true,
    title: sanitizeTitle(typeof value.title === "string" ? value.title : ""),
  };
}
