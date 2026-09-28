import { describe, expect, it } from "vitest";
import { adjustScore, initialTruco, sanitizeTruco } from "./model";

describe("truco", () => {
  it("acota entre 0 y 30", () => {
    const zero = initialTruco();
    expect(adjustScore(zero, "nosotros", -1)).toBe(zero);
    let s = zero;
    for (let i = 0; i < 40; i++) s = adjustScore(s, "ellos", 1);
    expect(s.ellos).toBe(30);
    expect(adjustScore(s, "ellos", 1)).toBe(s);
    expect(s.nosotros).toBe(0);
  });

  it("sanea lo guardado", () => {
    expect(sanitizeTruco({ nosotros: 99, ellos: -4 })).toEqual({ nosotros: 30, ellos: 0 });
    expect(sanitizeTruco({ nosotros: 1 })).toBeNull();
    expect(sanitizeTruco(null)).toBeNull();
  });
});
