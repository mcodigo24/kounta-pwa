"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Evento no estándar (Chromium): permite mostrar el diálogo de instalación cuando queramos. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
let captured = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

/** Engancha los eventos de instalación una sola vez (los llama el layout raíz al montar). */
export function captureInstallPrompt() {
  if (captured) return;
  captured = true;
  installed = isStandalone();
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installed = true;
    emit();
  });
}

if (typeof window !== "undefined") captureInstallPrompt();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export type InstallState = "unknown" | "installed" | "promptable" | "ios" | "manual";

/** Estado de la instalación según navegador/plataforma. */
function getState(): InstallState {
  if (installed || isStandalone()) return "installed";
  if (deferred) return "promptable";
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return iOS ? "ios" : "manual";
}

export function useInstall() {
  const state = useSyncExternalStore(subscribe, getState, () => "unknown" as InstallState);

  const install = useCallback(async () => {
    if (!deferred) return;
    const event = deferred;
    deferred = null;
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === "accepted") installed = true;
    emit();
  }, []);

  return { state, install };
}
