export const MAX_PLAYER_NAME_LENGTH = 3;
export const MAX_PLAYERS = 12;
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Mayúsculas, solo A-Z y 0-9, máximo 3 caracteres. Puede devolver "". */
export function normalizePlayerName(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, MAX_PLAYER_NAME_LENGTH);
}

/** Nombre guardado o "?" si quedó vacío tras normalizar. */
export function sanitizePlayerName(raw: unknown): string {
  return (typeof raw === "string" ? normalizePlayerName(raw) : "") || "?";
}

/** Primera letra A-Z que todavía no está en uso; si se agotan, "?". */
export function nextUnusedLetter(used: readonly string[]): string {
  return [...ALPHABET].find((letter) => !used.includes(letter)) ?? "?";
}

/** Iniciales por defecto: A, B, C… */
export function defaultInitials(count: number): string[] {
  const names: string[] = [];
  for (let i = 0; i < count; i++) names.push(nextUnusedLetter(names));
  return names;
}

/** Ajusta la lista de nombres a `count`: conserva los existentes y agrega letras libres. */
export function resizeInitials(initials: readonly string[], count: number): string[] {
  const next = initials.slice(0, count);
  while (next.length < count) next.push(nextUnusedLetter(next));
  return next;
}

export function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

/** Lista de nombres válida (o null) para restaurar desde almacenamiento. */
export function sanitizeInitials(raw: unknown, min: number, max: number): string[] | null {
  if (!Array.isArray(raw) || raw.length < min || raw.length > max) return null;
  return raw.map(sanitizePlayerName);
}
