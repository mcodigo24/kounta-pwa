import { clampInt, MAX_PLAYERS, normalizePlayerName, resizeInitials, sanitizeInitials } from "@/src/shared/game/players";

export const MIN_GENERALA_PLAYERS = 1;
export const MAX_GENERALA_PLAYERS = MAX_PLAYERS;

export interface GeneralaRow {
  label: string;
  name: string;
  /** Valores anotables (además de vacío y tachado). */
  values: readonly number[];
}

const multiples = (n: number) => [1, 2, 3, 4, 5].map((k) => k * n);

export const GENERALA_ROWS: readonly GeneralaRow[] = [
  { label: "1", name: "Unos", values: multiples(1) },
  { label: "2", name: "Doses", values: multiples(2) },
  { label: "3", name: "Treses", values: multiples(3) },
  { label: "4", name: "Cuatros", values: multiples(4) },
  { label: "5", name: "Cincos", values: multiples(5) },
  { label: "6", name: "Seises", values: multiples(6) },
  { label: "E", name: "Escalera", values: [20, 25] },
  { label: "F", name: "Full", values: [30, 35] },
  { label: "P", name: "Póker", values: [40, 45] },
  { label: "G", name: "Generala", values: [50] },
  { label: "2G", name: "Doble Generala", values: [100] },
];

/** null = vacío ("-"), 0 = tachado ("X"). */
export type Cell = number | null;

export interface GeneralaState {
  initials: string[];
  /** board[jugador][fila] */
  board: Cell[][];
}

const emptyColumn = (): Cell[] => GENERALA_ROWS.map(() => null);

export const initialGenerala = (): GeneralaState => ({
  initials: ["A", "B"],
  board: [emptyColumn(), emptyColumn()],
});

/** Vacío → valores permitidos en orden → X (0) → vacío. */
export function nextCellValue(row: number, current: Cell): Cell {
  const cycle: Cell[] = [null, ...GENERALA_ROWS[row].values, 0];
  const index = cycle.indexOf(current);
  return cycle[(index + 1) % cycle.length];
}

export function cycleCell(state: GeneralaState, player: number, row: number): GeneralaState {
  const board = state.board.map((column, p) =>
    p === player ? column.map((cell, r) => (r === row ? nextCellValue(row, cell) : cell)) : column,
  );
  return { ...state, board };
}

export function setPlayerCount(state: GeneralaState, count: number): GeneralaState {
  const n = clampInt(count, MIN_GENERALA_PLAYERS, MAX_GENERALA_PLAYERS);
  if (n === state.initials.length) return state;
  const board = state.board.slice(0, n);
  while (board.length < n) board.push(emptyColumn());
  return { initials: resizeInitials(state.initials, n), board };
}

export function renamePlayer(state: GeneralaState, player: number, raw: string): GeneralaState {
  const name = normalizePlayerName(raw);
  if (!name || name === state.initials[player]) return state;
  return { ...state, initials: state.initials.map((n, i) => (i === player ? name : n)) };
}

export const playerTotal = (state: GeneralaState, player: number): number =>
  state.board[player].reduce<number>((sum, cell) => sum + (cell ?? 0), 0);

export function sanitizeGenerala(raw: unknown): GeneralaState | null {
  const value = raw as Partial<GeneralaState> | null;
  const initials = sanitizeInitials(value?.initials, MIN_GENERALA_PLAYERS, MAX_GENERALA_PLAYERS);
  if (!initials || !Array.isArray(value?.board)) return null;
  const board = initials.map((_, p) => {
    const column = Array.isArray(value.board![p]) ? (value.board![p] as unknown[]) : [];
    return GENERALA_ROWS.map((_, r) => (typeof column[r] === "number" ? (column[r] as number) : null));
  });
  return { initials, board };
}
