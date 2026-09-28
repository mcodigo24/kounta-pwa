import { describe, expect, it } from "vitest";
import {
  commitCell,
  ERROR_NOT_ENTERED,
  ERROR_OVER_TARGET,
  hasStarted,
  hasWon,
  remainingOf,
  renamePlayer,
  sanitizeDiezMil,
  setPlayerCount,
  startDiezMil,
  totalOf,
} from "./model";

const enter = (s: ReturnType<typeof startDiezMil>, r: number, p: number, v: string) => commitCell(s, r, p, v);

describe("10 mil", () => {
  it("no entra con menos de 750: la celda queda en 0 y puede intentar en la próxima ronda", () => {
    let res = enter(startDiezMil(2), 0, 0, "500");
    expect(res.error).toBe(ERROR_NOT_ENTERED);
    expect(res.state.rounds[0][0]).toBe(0);
    expect(hasStarted(res.state.rounds, 0)).toBe(false);
    res = enter(res.state, 1, 0, "800");
    expect(res.error).toBeNull();
    expect(hasStarted(res.state.rounds, 0)).toBe(true);
    expect(totalOf(res.state.rounds, 0)).toBe(800);
  });

  it("entra con 750 o más y suma", () => {
    let s = enter(startDiezMil(2), 0, 0, "750").state;
    s = enter(s, 1, 0, "250").state;
    expect(totalOf(s.rounds, 0)).toBe(1000);
    expect(remainingOf(s.rounds, 0)).toBe(9000);
    expect(totalOf(s.rounds, 1)).toBe(0);
  });

  it("rechaza pasarse de 10000 y revierte", () => {
    const s = enter(startDiezMil(2), 0, 0, "9500").state;
    const res = enter(s, 1, 0, "600");
    expect(res.error).toBe(ERROR_OVER_TARGET);
    expect(res.state).toBe(s);
  });

  it("gana con exactamente 10000 y ordena el podio", () => {
    let s = enter(startDiezMil(3), 0, 1, "9000").state;
    s = enter(s, 1, 1, "1000").state;
    s = enter(s, 0, 0, "5000").state;
    s = enter(s, 1, 0, "5000").state;
    expect(hasWon(s.rounds, 1)).toBe(true);
    expect(s.placementOrder).toEqual([1, 0]);
    // el ganador no se puede renombrar
    expect(renamePlayer(s, 1, "zz")).toBe(s);
    // deshacer el puntaje lo saca del podio
    s = enter(s, 1, 1, "").state;
    expect(s.placementOrder).toEqual([0]);
  });

  it("cambia cantidad de jugadores sin duplicar nombres y limpia podio", () => {
    let s = startDiezMil(4);
    s = renamePlayer(s, 0, "x");
    s = setPlayerCount(s, 5);
    expect(new Set(s.initials).size).toBe(5);
    expect(setPlayerCount(s, 1).initials.length).toBe(2);
  });

  it("conserva el podio al sanear", () => {
    let s = enter(startDiezMil(2), 0, 0, "10000").state;
    s = enter(s, 0, 1, "10000").state;
    s = enter(s, 0, 0, "").state;
    expect(sanitizeDiezMil(JSON.parse(JSON.stringify(s)))?.placementOrder).toEqual([1]);
  });
});
