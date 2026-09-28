"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AUTO_SAVE_DELAY_MS, type GameStore } from "@/src/shared/persistence/gameStore";

export type SaveStatus = "idle" | "pending" | "saved";

interface Options<T> {
  store: GameStore<T>;
  initial: () => T;
}

/**
 * Estado de una partida con autoguardado: cada cambio programa un guardado a los 30 s y se
 * fuerza al pasar a segundo plano (visibilitychange / pagehide). `reset` borra lo guardado.
 * Debe montarse solo en el cliente (lee localStorage en el estado inicial).
 */
export function usePersistentGame<T>({ store, initial }: Options<T>) {
  const [state, setState] = useState<T>(() => store.load() ?? initial());
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const latest = useRef(state);
  const dirty = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    if (!dirty.current) return;
    dirty.current = false;
    store.save(latest.current);
    setSaveStatus("saved");
  }, [store]);

  /** Aplica el cambio sobre el último estado (varios cambios en un mismo tick se componen). */
  const update = useCallback(
    (updater: (current: T) => T) => {
      const next = updater(latest.current);
      if (Object.is(next, latest.current)) return;
      latest.current = next;
      dirty.current = true;
      setState(next);
      setSaveStatus("pending");
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, AUTO_SAVE_DELAY_MS);
    },
    [flush],
  );

  const reset = useCallback(
    (next: T = initial()) => {
      window.clearTimeout(timer.current);
      dirty.current = false;
      store.clear();
      latest.current = next;
      setState(next);
      setSaveStatus("idle");
    },
    [store, initial],
  );

  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [flush]);

  return { state, update, reset, saveStatus };
}
