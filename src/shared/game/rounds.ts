/** Una ronda = un valor (o null = vacío) por jugador. */
export type Round = (number | null)[];

const MAX_DIGITS = 9;

export const emptyRound = (players: number): Round => Array<number | null>(players).fill(null);

export const isRoundEmpty = (round: Round): boolean => round.every((value) => value === null);

/** Garantiza exactamente una ronda vacía al final (agrega una o descarta las sobrantes). */
export function ensureTrailingEmptyRound(rounds: Round[], players: number): Round[] {
  let end = rounds.length;
  while (end > 1 && isRoundEmpty(rounds[end - 1]) && isRoundEmpty(rounds[end - 2])) end--;
  const trimmed = end === rounds.length ? rounds : rounds.slice(0, end);
  const last = trimmed[trimmed.length - 1];
  if (last && isRoundEmpty(last)) return trimmed;
  return [...trimmed, emptyRound(players)];
}

/** Ajusta cada ronda a `players` columnas y deja una ronda vacía al final. */
export function normalizeRounds(rounds: readonly Round[], players: number): Round[] {
  const fixed = rounds.map((round) =>
    Array.from({ length: players }, (_, p) => (Number.isInteger(round[p]) ? (round[p] as number) : null)),
  );
  return ensureTrailingEmptyRound(fixed, players);
}

/** Rondas válidas (o null) para restaurar desde almacenamiento. */
export function sanitizeRounds(raw: unknown, players: number): Round[] | null {
  if (!Array.isArray(raw)) return null;
  const rows = raw.map((row) => (Array.isArray(row) ? (row as unknown[]) : []));
  return normalizeRounds(
    rows.map((row) => row.map((v) => (typeof v === "number" ? v : null))),
    players,
  );
}

export type ParsedCell = { ok: true; value: number | null } | { ok: false };

/** "" o "-" ⇒ celda vacía; entero ⇒ valor; cualquier otra cosa se rechaza. */
export function parseCellInput(raw: string): ParsedCell {
  const text = raw.trim();
  if (text === "" || text === "-") return { ok: true, value: null };
  if (!/^-?\d+$/.test(text) || text.replace("-", "").length > MAX_DIGITS) return { ok: false };
  return { ok: true, value: Number.parseInt(text, 10) };
}

export function setCell(rounds: Round[], round: number, player: number, value: number | null): Round[] {
  return rounds.map((row, r) => (r === round ? row.map((v, p) => (p === player ? value : v)) : row));
}

export const sumColumn = (rounds: readonly Round[], player: number): number =>
  rounds.reduce((acc, row) => acc + (row[player] ?? 0), 0);
