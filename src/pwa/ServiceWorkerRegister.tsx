"use client";

import { useEffect } from "react";
import { captureInstallPrompt } from "./install";

/** Registra el service worker (solo en producción) y captura el aviso de instalación del navegador. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    captureInstallPrompt();
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {
      /* sin service worker la app sigue funcionando, solo que sin modo offline */
    });
  }, []);

  return null;
}
