"use client";

import { useEffect } from "react";

const AWAKE_MS = 40_000;

/**
 * Mantiene la pantalla encendida 40 s después de cada cambio de `resetKey` y la libera al
 * desmontar (Screen Wake Lock API; no hace nada donde no existe).
 */
export function useKeepScreenAwake(resetKey: unknown) {
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    navigator.wakeLock
      .request("screen")
      .then((lock) => {
        if (cancelled) void lock.release();
        else sentinel = lock;
      })
      .catch(() => {
        /* denegado (ahorro de batería, pestaña oculta…) */
      });
    const timer = window.setTimeout(() => void sentinel?.release(), AWAKE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      void sentinel?.release();
    };
  }, [resetKey]);
}
