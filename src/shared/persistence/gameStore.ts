/** Autoguardado: 30 s después del último cambio. */
export const AUTO_SAVE_DELAY_MS = 30_000;
/** Una partida guardada sin actividad caduca al día. */
export const SAVE_RETENTION_MS = 24 * 60 * 60 * 1000;

export interface GameStore<T> {
  /** Estado guardado y vigente, o null (inexistente, vencido, corrupto o de otra versión). */
  load(): T | null;
  save(value: T): void;
  clear(): void;
}

interface Envelope {
  v: number;
  lastUpdated: number;
  data: unknown;
}

interface StoreOptions<T> {
  key: string;
  version: number;
  /** Valida y normaliza lo leído; devuelve null si no es utilizable. */
  sanitize: (raw: unknown) => T | null;
  now?: () => number;
}

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function createGameStore<T>({ key, version, sanitize, now = Date.now }: StoreOptions<T>): GameStore<T> {
  const clear = () => {
    try {
      storage()?.removeItem(key);
    } catch {
      /* almacenamiento no disponible */
    }
  };

  return {
    load() {
      try {
        const text = storage()?.getItem(key);
        if (!text) return null;
        const envelope = JSON.parse(text) as Envelope;
        if (envelope?.v !== version || typeof envelope.lastUpdated !== "number") return null;
        if (now() - envelope.lastUpdated > SAVE_RETENTION_MS) {
          clear();
          return null;
        }
        return sanitize(envelope.data);
      } catch {
        return null;
      }
    },
    save(value) {
      try {
        const envelope: Envelope = { v: version, lastUpdated: now(), data: value };
        storage()?.setItem(key, JSON.stringify(envelope));
      } catch {
        /* cuota llena o modo privado: se sigue jugando sin persistir */
      }
    },
    clear,
  };
}
