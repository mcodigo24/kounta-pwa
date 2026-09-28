"use client";

import Link from "next/link";
import { useState } from "react";
import { clay } from "@/src/shared/ui/Clay";
import { Icon } from "@/src/shared/ui/Icon";
import { useInstall } from "./install";

const primary =
  "clay inline-flex items-center justify-center gap-2 rounded-clay bg-primary px-7 py-4 text-base font-semibold text-on-accent transition-transform active:scale-[0.98]";

/**
 * Botón "Descargar": abre el diálogo nativo de instalación (Android/Chrome/Edge), explica cómo
 * agregar a inicio en iPhone y, si ya está instalada, abre la app.
 */
export function InstallButton() {
  const { state, install } = useInstall();
  const [help, setHelp] = useState(false);

  if (state === "installed") {
    return (
      <Link href="/app" className={primary} style={clay(6)}>
        Abrir Kounta
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className={primary}
        style={clay(6)}
        onClick={() => (state === "promptable" ? void install() : setHelp(true))}
      >
        <Icon name="download" size={22} />
        Descargar la app
      </button>

      {help && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6" onPointerDown={(e) => e.target === e.currentTarget && setHelp(false)}>
          <div role="dialog" aria-modal="true" aria-label="Cómo instalar Kounta" className="w-full max-w-sm rounded-[28px] bg-variant p-6 text-left shadow-2xl">
            <h2 className="text-2xl leading-8 text-strong">Instalá Kounta</h2>
            {state === "ios" ? (
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-5 text-text">
                <li>Abrí esta página en <strong>Safari</strong>.</li>
                <li>
                  Tocá <Icon name="share" size={16} className="inline align-text-bottom" /> <strong>Compartir</strong>.
                </li>
                <li>
                  Elegí <strong>Agregar a inicio</strong> y confirmá.
                </li>
              </ol>
            ) : (
              <p className="mt-4 text-sm leading-5 text-text">
                Este navegador no ofrece la instalación con un toque. Abrí el menú del navegador y elegí <strong>Instalar app</strong> o{" "}
                <strong>Agregar a la pantalla de inicio</strong>. También podés usar Kounta directo desde el navegador.
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <Link href="/app" className="rounded-full px-3 py-2 text-sm font-medium text-primary active:bg-primary/15">
                Abrir en el navegador
              </Link>
              <button type="button" onClick={() => setHelp(false)} className="rounded-full px-3 py-2 text-sm font-medium text-primary active:bg-primary/15">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
