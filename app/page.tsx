import Link from "next/link";
import { GAMES } from "@/src/games/registry";
import { InstallButton } from "@/src/pwa/InstallButton";
import { clay, KountaSection } from "@/src/shared/ui/Clay";
import { Icon, type IconName } from "@/src/shared/ui/Icon";

const FEATURES: { title: string; text: string }[] = [
  { title: "Autoguardado", text: "Tu partida se guarda sola y la recuperás aunque cierres la app a mitad de juego." },
  { title: "Sin conexión", text: "Funciona 100% offline. Todo queda en tu dispositivo: sin cuentas, sin anuncios, sin backend." },
  { title: "Pensada para la mesa", text: "Paleta cálida y números grandes para leerse bien desde el otro lado, con la pantalla siempre encendida mientras jugás." },
  { title: "Sin accidentes", text: "Reiniciar pide confirmación: nunca perdés una partida por un toque de más." },
];

const INSTALL_STEPS: { device: string; icon: IconName; steps: string[] }[] = [
  {
    device: "Android",
    icon: "dashboard",
    steps: ["Abrí Kounta en Chrome.", "Tocá “Descargar la app” y confirmá.", "Buscá el ícono en tu pantalla de inicio."],
  },
  {
    device: "iPhone / iPad",
    icon: "share",
    steps: ["Abrí esta página en Safari.", "Tocá Compartir.", "Elegí “Agregar a inicio”."],
  },
  {
    device: "Computadora",
    icon: "leaderboard",
    steps: ["Abrí Kounta en Chrome o Edge.", "Tocá “Descargar la app” o el ícono de instalar en la barra de direcciones.", "Se abre como una app más."],
  },
];

export default function LandingPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-20 px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-16">
      <header className="grid items-center gap-12 pt-6 md:grid-cols-[1.1fr_0.9fr] md:pt-16">
        <div className="text-center md:text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-192.png" alt="" width={72} height={72} className="clay mx-auto rounded-[20px] md:mx-0" style={clay(8)} />
          <h1 className="mt-6 text-6xl leading-none font-bold tracking-tight text-primary md:text-7xl">Kounta</h1>
          <p className="mx-auto mt-4 max-w-md text-xl leading-8 text-strong md:mx-0">Anotador de puntajes para tus juegos de cartas y dados favoritos.</p>
          <p className="mx-auto mt-2 max-w-md text-base leading-6 text-muted md:mx-0">Truco · Generala · Chin Chon · 10 mil · Comodín</p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start sm:justify-center">
            <InstallButton />
            <Link
              href="/app"
              className="rounded-clay border border-line-focus px-7 py-4 text-base font-semibold text-primary transition-colors active:bg-primary/15"
            >
              Abrir en el navegador
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">Gratis · Sin cuentas · Sin anuncios · Funciona en Android, iPhone y computadora</p>
        </div>

        <ScoreboardPreview />
      </header>

      <section aria-labelledby="juegos">
        <h2 id="juegos" className="text-3xl leading-9 font-bold">
          Cinco anotadores, una sola app
        </h2>
        <p className="mt-2 max-w-xl text-base text-muted">Elegís el juego, anotás y listo. Sin lápiz, sin papel, sin sumar a mano.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => (
            <li key={game.id}>
              <Link href={game.href} className="clay block h-full rounded-clay bg-surface p-6 transition-transform active:scale-[0.98]" style={clay(8)}>
                <span className="grid size-11 place-items-center rounded-full bg-primary text-background">
                  <Icon name={game.icon} size={24} />
                </span>
                <h3 className="mt-4 text-xl leading-7 font-semibold">{game.title}</h3>
                <p className="mt-1 text-sm leading-5 text-text">{game.about}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="caracteristicas">
        <h2 id="caracteristicas" className="text-3xl leading-9 font-bold">
          Hecha para jugar tranquilo
        </h2>
        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="border-l-2 border-primary/60 pl-4">
              <dt className="text-lg leading-6 font-semibold text-primary">{feature.title}</dt>
              <dd className="mt-1 text-base leading-6 text-text">{feature.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="instalar">
        <h2 id="instalar" className="text-3xl leading-9 font-bold">
          Instalala en tu dispositivo
        </h2>
        <p className="mt-2 max-w-xl text-base text-muted">No hace falta tienda de aplicaciones: se instala desde el navegador en unos segundos y después funciona sin internet.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {INSTALL_STEPS.map((item) => (
            <KountaSection key={item.device} className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-primary">
                <Icon name={item.icon} size={20} />
                {item.device}
              </h3>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-5 text-text">
                {item.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </KountaSection>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <InstallButton />
        </div>
      </section>

      <footer className="mt-auto pt-8 text-center text-sm text-muted">Hecho con 🧉 para las mesas de siempre.</footer>
    </div>
  );
}

/** Vista previa decorativa del marcador de Truco. */
function ScoreboardPreview() {
  return (
    <div aria-hidden="true" className="clay mx-auto w-full max-w-xs rounded-[36px] border border-line bg-surface p-5" style={clay(14)}>
      <div className="flex flex-col divide-y divide-line rounded-clay bg-background">
        {[
          { name: "Nosotros", score: 24 },
          { name: "Ellos", score: 19 },
        ].map((team) => (
          <div key={team.name} className="flex flex-col items-center px-6 py-7">
            <span className="text-lg font-medium text-strong/75">{team.name}</span>
            <span className="text-8xl leading-none font-bold text-strong">{team.score}</span>
            <span className="mt-5 flex gap-5">
              <span className="grid size-14 place-items-center rounded-full bg-surface text-primary">
                <Icon name="remove" size={26} />
              </span>
              <span className="grid size-14 place-items-center rounded-full bg-secondary text-on-accent">
                <Icon name="add" size={26} />
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
