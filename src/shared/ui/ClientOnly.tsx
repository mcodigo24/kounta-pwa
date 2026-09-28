"use client";

import type { ReactNode } from "react";
import { useIsClient } from "@/src/shared/hooks/useMediaQuery";

/**
 * Las partidas viven en localStorage: se montan recién en el cliente para que el estado
 * restaurado no choque con el HTML prerenderizado.
 */
export function ClientOnly({ children }: { children: ReactNode }) {
  return useIsClient() ? <>{children}</> : <div className="flex-1" />;
}
