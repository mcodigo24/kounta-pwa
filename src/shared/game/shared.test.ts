import { describe, expect, it } from "vitest";
import { defaultInitials, nextUnusedLetter, normalizePlayerName, resizeInitials } from "./players";
import { ensureTrailingEmptyRound, parseCellInput } from "./rounds";

describe("players", () => {
  it("normaliza nombres", () => {
    expect(normalizePlayerName("ab-c9x")).toBe("ABC");
    expect(normalizePlayerName("¡!")).toBe("");
  });

  it("letras libres sin duplicar", () => {
    expect(nextUnusedLetter(["A", "C"])).toBe("B");
    expect(defaultInitials(3)).toEqual(["A", "B", "C"]);
    expect(resizeInitials(["ZZ", "A"], 4)).toEqual(["ZZ", "A", "B", "C"]);
    expect(resizeInitials(["A", "B", "C"], 2)).toEqual(["A", "B"]);
  });
});

describe("rounds", () => {
  it("parsea celdas", () => {
    expect(parseCellInput("")).toEqual({ ok: true, value: null });
    expect(parseCellInput("-")).toEqual({ ok: true, value: null });
    expect(parseCellInput(" -12 ")).toEqual({ ok: true, value: -12 });
    expect(parseCellInput("1.5")).toEqual({ ok: false });
    expect(parseCellInput("1234567890")).toEqual({ ok: false });
  });

  it("mantiene una ronda vacía al final", () => {
    expect(ensureTrailingEmptyRound([[1, null]], 2)).toEqual([
      [1, null],
      [null, null],
    ]);
    const ok = [[null, null]];
    expect(ensureTrailingEmptyRound(ok, 2)).toBe(ok);
  });
});
