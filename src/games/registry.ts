import type { IconName } from "@/src/shared/ui/Icon";

export type GameId = "truco" | "generala" | "chinchon" | "diezmil" | "comodin";

export interface GameEntry {
  id: GameId;
  title: string;
  subtitle: string;
  /** Descripción larga para la landing. */
  about: string;
  icon: IconName;
  href: string;
}

/** Fuente única de los juegos: la usan el inicio, la barra inferior y la landing. */
export const GAMES: readonly GameEntry[] = [
  {
    id: "truco",
    title: "Truco",
    subtitle: "Anotador básico de truco.",
    about: "Marcador clásico Nosotros vs. Ellos, de 0 a 30 puntos.",
    icon: "style",
    href: "/app/truco",
  },
  {
    id: "generala",
    title: "Generala",
    subtitle: "Anotador listo para usar, solo disfruta.",
    about: "Planilla completa para hasta 12 jugadores: todas las filas (1 a 6, Escalera, Full, Póker, Generala y Doble) y totales automáticos.",
    icon: "casino",
    href: "/app/generala",
  },
  {
    id: "chinchon",
    title: "Chin Chon",
    subtitle: "Anotador basado en las reglas del juego.",
    about: "Planilla por rondas con valores positivos y negativos, total acumulado y aviso en rojo al llegar a 100.",
    icon: "carousel",
    href: "/app/chinchon",
  },
  {
    id: "diezmil",
    title: "10 mil",
    subtitle: "Anotador listo para usar, solo disfruta y llega exacto a 10.000.",
    about: "Planilla por rondas: se entra con 750 y se gana llegando exacto a 10.000, con aviso visual y podio.",
    icon: "leaderboard",
    href: "/app/diezmil",
  },
  {
    id: "comodin",
    title: "Comodín",
    subtitle: "Úsalo cuando tengas que anotar puntajes de algún juego, es un anotador genérico.",
    about: "Anotador genérico por rondas para cualquier otro juego que se te ocurra, con o sin puntajes negativos.",
    icon: "dashboard",
    href: "/app/comodin",
  },
];
