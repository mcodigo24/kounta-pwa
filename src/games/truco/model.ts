import { clampInt } from "@/src/shared/game/players";

export const MIN_SCORE = 0;
export const MAX_SCORE = 30;

export type Team = "nosotros" | "ellos";
export interface TrucoState {
  nosotros: number;
  ellos: number;
}

export const initialTruco = (): TrucoState => ({ nosotros: 0, ellos: 0 });

/** ±delta al equipo, acotado a 0..30. Devuelve el mismo objeto si no cambia nada. */
export function adjustScore(state: TrucoState, team: Team, delta: number): TrucoState {
  const next = clampInt(state[team] + delta, MIN_SCORE, MAX_SCORE);
  return next === state[team] ? state : { ...state, [team]: next };
}

export function sanitizeTruco(raw: unknown): TrucoState | null {
  const value = raw as Partial<Record<Team, unknown>> | null;
  if (!value || !Number.isFinite(value.nosotros) || !Number.isFinite(value.ellos)) return null;
  return {
    nosotros: clampInt(value.nosotros as number, MIN_SCORE, MAX_SCORE),
    ellos: clampInt(value.ellos as number, MIN_SCORE, MAX_SCORE),
  };
}
