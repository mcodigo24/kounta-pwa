import { describe, expect, it } from "vitest";
import { cycleCell, initialGenerala, nextCellValue, playerTotal, renamePlayer, sanitizeGenerala, setPlayerCount } from "./model";

describe("generala", () => {
  it("cicla vacío → valores → X → vacío", () => {
    expect(nextCellValue(0, null)).toBe(1);
    expect(nextCellValue(0, 5)).toBe(0);
    expect(nextCellValue(0, 0)).toBeNull();
    expect(nextCellValue(9, null)).toBe(50); // G
    expect(nextCellValue(9, 50)).toBe(0);
    expect(nextCellValue(6, 20)).toBe(25); // E
  });

  it("suma totales, X cuenta 0", () => {
    let s = initialGenerala();
    s = cycleCell(s, 0, 0); // 1
    s = cycleCell(s, 0, 9); // G 50
    s = cycleCell(s, 0, 1);
    s = cycleCell(s, 0, 1);
    s = cycleCell(s, 0, 1);
    s = cycleCell(s, 0, 1);
    s = cycleCell(s, 0, 1);
    s = cycleCell(s, 0, 1); // doses: X
    expect(playerTotal(s, 0)).toBe(51);
    expect(playerTotal(s, 1)).toBe(0);
  });

  it("cambia cantidad de jugadores entre 1 y 12 sin repetir nombres", () => {
    let s = renamePlayer(initialGenerala(), 0, "b");
    s = setPlayerCount(s, 3);
    expect(s.initials).toEqual(["B", "B", "A"]);
    expect(setPlayerCount(s, 0).initials.length).toBe(1);
    expect(setPlayerCount(s, 99).initials.length).toBe(12);
  });

  it("ignora nombre vacío al renombrar", () => {
    const s = initialGenerala();
    expect(renamePlayer(s, 0, "--")).toBe(s);
  });

  it("sanea", () => {
    expect(sanitizeGenerala({ initials: ["a"], board: [[1, "x"]] })?.board[0].length).toBe(11);
    expect(sanitizeGenerala({ initials: [], board: [] })).toBeNull();
  });
});
