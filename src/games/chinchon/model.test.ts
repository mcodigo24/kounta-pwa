import { describe, expect, it } from "vitest";
import { addPlayer, analyzePlayer, sanitizeChinChon, startChinChon, updateCell } from "./model";

const type = (s: ReturnType<typeof startChinChon>, r: number, p: number, v: string) => updateCell(s, r, p, v);

describe("chinchon", () => {
  it("arranca con jugadores y una ronda vacía", () => {
    const s = startChinChon(4);
    expect(s.initials).toEqual(["A", "B", "C", "D"]);
    expect(s.rounds).toEqual([[null, null, null, null]]);
  });

  it("agrega una ronda vacía al cargar y descarta las sobrantes al borrar", () => {
    let s = type(startChinChon(2), 0, 0, "10");
    expect(s.rounds.length).toBe(2);
    s = type(s, 0, 0, "");
    expect(s.rounds.length).toBe(1);
  });

  it("pierde al llegar a 100 y reingresa con el próximo valor", () => {
    let s = startChinChon(2);
    s = type(s, 0, 0, "60");
    s = type(s, 1, 0, "40");
    expect(analyzePlayer(s.rounds, 0)).toEqual({ total: 100, lost: true, segmentStart: 0 });
    s = type(s, 2, 0, "15");
    expect(analyzePlayer(s.rounds, 0)).toEqual({ total: 15, lost: false, segmentStart: 2 });
  });

  it("acepta negativos y rechaza basura", () => {
    const s = type(startChinChon(2), 0, 0, "-5");
    expect(analyzePlayer(s.rounds, 0).total).toBe(-5);
    const same = type(s, 0, 0, "abc");
    expect(same).toBe(s);
  });

  it("nuevo jugador arranca con el máximo entre los que siguen en juego", () => {
    let s = startChinChon(3);
    s = type(s, 0, 0, "120"); // A perdió
    s = type(s, 1, 1, "40");
    s = type(s, 1, 2, "25");
    const next = addPlayer(s);
    expect(next.initials).toEqual(["A", "B", "C", "D"]);
    const last = next.rounds[next.rounds.length - 2];
    expect(last[3]).toBe(40);
    expect(next.rounds[0][3]).toBe(0);
    expect(next.rounds[next.rounds.length - 1]).toEqual([null, null, null, null]);
  });

  it("nuevo jugador con todos perdidos arranca en 0", () => {
    let s = startChinChon(2);
    s = type(s, 0, 0, "100");
    s = type(s, 0, 1, "100");
    const next = addPlayer(s);
    expect(analyzePlayer(next.rounds, 2).total).toBe(0);
  });

  it("no pasa de 12 jugadores", () => {
    const s = startChinChon(12);
    expect(addPlayer(s)).toBe(s);
  });

  it("sanea", () => {
    expect(sanitizeChinChon({ isConfigured: false })).toBeNull();
    expect(sanitizeChinChon({ isConfigured: true, initials: ["a", "b"], rounds: [[1]] })?.rounds).toEqual([
      [1, null],
      [null, null],
    ]);
  });
});
