"use client";

import { useSyncExternalStore } from "react";

/** Suscripción a una media query; en el servidor devuelve `serverValue`. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Teléfono en horizontal: como en la app Android, la barra inferior se oculta y la superior se compacta. */
export const useIsLandscape = () => useMediaQuery("(orientation: landscape) and (max-height: 500px)");

/** false en el servidor y en la hidratación; true ya montado en el cliente. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
