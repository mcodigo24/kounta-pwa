import { describe, expect, it } from "vitest";
import { addPlayer, sanitizeComodin, sanitizeTitle, startComodin, totalOf, updateCell, updateTitle } from "./model";

describe("comodín", () => {
  it("limita y normaliza el título (también en el setup)", () => {
    expect(startComodin(2, false, "   ").title).toBe("Comodín");
    expect(startComodin(2, false, "x".repeat(60)).title.length).toBe(40);
    expect(sanitizeTitle("  Rummy ")).toBe("Rummy");
    const s = startComodin(2, false, "A");
    expect(updateTitle(s, "A")).toBe(s);
  });

  it("rechaza negativos cuando no están habilitados", () => {
    const s = startComodin(2, false, "");
    expect(updateCell(s, 0, 0, "-5")).toBe(s);
    expect(updateCell(updateCell(s, 0, 0, "5"), 0, 0, "7").rounds[0][0]).toBe(7);
  });

  it("acepta negativos si están habilitados y suma", () => {
    let s = startComodin(1, true, "");
    s = updateCell(s, 0, 0, "10");
    s = updateCell(s, 1, 0, "-4");
    expect(totalOf(s, 0)).toBe(6);
  });

  it("agrega equipos con letra libre hasta 12", () => {
    let s = startComodin(11, false, "");
    s = addPlayer(s);
    expect(s.initials.length).toBe(12);
    expect(addPlayer(s)).toBe(s);
    expect(s.rounds.every((r) => r.length === 12)).toBe(true);
  });

  it("sanea", () => {
    expect(sanitizeComodin({ isConfigured: true, initials: ["a"], rounds: [], allowNegatives: 1 })?.allowNegatives).toBe(false);
    expect(sanitizeComodin({})).toBeNull();
  });
});
