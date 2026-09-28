import { beforeEach, describe, expect, it } from "vitest";
import { createGameStore, SAVE_RETENTION_MS } from "./gameStore";

const sanitize = (raw: unknown) => (typeof raw === "number" ? raw : null);

describe("createGameStore", () => {
  beforeEach(() => localStorage.clear());

  it("guarda y carga", () => {
    const store = createGameStore({ key: "t", version: 1, sanitize });
    store.save(7);
    expect(store.load()).toBe(7);
  });

  it("expira pasado el día y limpia", () => {
    let t = 1_000;
    const store = createGameStore({ key: "t", version: 1, sanitize, now: () => t });
    store.save(7);
    t += SAVE_RETENTION_MS + 1;
    expect(store.load()).toBeNull();
    expect(localStorage.getItem("t")).toBeNull();
  });

  it("vigente justo en el límite", () => {
    let t = 1_000;
    const store = createGameStore({ key: "t", version: 1, sanitize, now: () => t });
    store.save(7);
    t += SAVE_RETENTION_MS;
    expect(store.load()).toBe(7);
  });

  it("ignora otra versión y datos corruptos", () => {
    createGameStore({ key: "t", version: 1, sanitize }).save(7);
    expect(createGameStore({ key: "t", version: 2, sanitize }).load()).toBeNull();
    localStorage.setItem("t", "{no json");
    expect(createGameStore({ key: "t", version: 1, sanitize }).load()).toBeNull();
  });

  it("descarta lo que sanitize rechaza", () => {
    const store = createGameStore({ key: "t", version: 1, sanitize });
    store.save("x" as unknown as number);
    expect(store.load()).toBeNull();
  });

  it("clear borra", () => {
    const store = createGameStore({ key: "t", version: 1, sanitize });
    store.save(7);
    store.clear();
    expect(store.load()).toBeNull();
  });
});
