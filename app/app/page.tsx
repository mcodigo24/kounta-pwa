import { GAMES } from "@/src/games/registry";
import { KountaCard } from "@/src/shared/ui/Clay";

export default function HomePage() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-5 py-8">
        <header className="pb-3 text-center">
          <h1 className="pb-1 text-[28px] leading-9 font-bold text-primary">Kounta</h1>
          <p className="text-base leading-6 text-muted">Elegí el juego para empezar</p>
        </header>

        {GAMES.map((game) => (
          <KountaCard key={game.id} href={game.href}>
            <div className="p-[22px]">
              <h2 className="text-xl leading-7 font-semibold text-strong">{game.title}</h2>
              <p className="mt-1 text-sm leading-5 text-text">{game.subtitle}</p>
            </div>
          </KountaCard>
        ))}
      </div>
    </div>
  );
}
