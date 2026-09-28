"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GAMES } from "@/src/games/registry";
import { useIsLandscape } from "@/src/shared/hooks/useMediaQuery";
import { Icon, type IconName } from "./Icon";

const ITEMS: { href: string; title: string; icon: IconName }[] = [
  { href: "/app", title: "Inicio", icon: "home" },
  ...GAMES.map(({ href, title, icon }) => ({ href, title, icon })),
];

/** Barra inferior con Inicio + los 5 juegos. Se oculta con el teléfono en horizontal. */
export function BottomNav() {
  const pathname = usePathname().replace(/\/$/, "");
  const landscape = useIsLandscape();
  if (landscape) return null;

  return (
    <nav aria-label="Juegos" className="flex shrink-0 bg-nav pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {ITEMS.map((item) => {
        const selected = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={selected ? "page" : undefined}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 pt-3 pb-4"
          >
            <span className={`grid h-8 w-16 place-items-center rounded-full transition-colors ${selected ? "bg-primary text-background" : "text-muted"}`}>
              <Icon name={item.icon} size={20} />
            </span>
            <span className={`max-w-full truncate px-0.5 text-[11px] leading-4 font-medium ${selected ? "text-primary" : "text-muted"}`}>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
