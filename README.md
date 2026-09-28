<div align="center">

# 🎲 Kounta

**Anotador de puntajes para tus juegos de cartas y dados favoritos.**

Truco · Generala · Chin Chon · 10 mil · Comodín

PWA instalable en **Android, iPhone y computadora** · Funciona sin conexión

</div>

---

## Qué es

Kounta es una PWA (aplicación web instalable) para llevar el puntaje de partidas de cartas y dados sin lápiz ni papel. Es la versión web de la app Android original: mismo diseño (claymorfismo oscuro ámbar/durazno) y mismas funciones.

Sin backend, sin cuentas, sin anuncios. Todo el estado se guarda en el dispositivo (`localStorage`) y se recupera si cerrás la app a mitad de partida.

- `/` — landing de bienvenida con el botón **Descargar la app** (instalación PWA).
- `/app` — la aplicación: inicio con los juegos, barra inferior y un anotador por juego.

## Juegos

| Juego | Descripción |
|---|---|
| Truco | Marcador Nosotros vs. Ellos, de 0 a 30. |
| Generala | Planilla de hasta 12 jugadores: 1–6, Escalera, Full, Póker, Generala y Doble, con totales. |
| Chin Chon | Planilla por rondas con valores ±, total acumulado; al llegar a 100 la columna se marca en rojo y el próximo valor reinicia el conteo. |
| 10 mil | Planilla por rondas: se entra con 750, se gana llegando justo a 10.000 (con podio). |
| Comodín | Anotador genérico por rondas, con o sin negativos y con nombre propio. |

## Comportamiento

- **Autoguardado** 30 s después del último cambio, y al pasar la app a segundo plano.
- **Caducidad**: una partida sin actividad durante 1 día se descarta.
- **Pantalla encendida** 40 s después de cada cambio (Screen Wake Lock, donde el navegador lo soporte).
- **Offline**: un service worker guarda las páginas y sus archivos al instalar.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 (tokens de la paleta en `app/globals.css`)
- Vitest para las reglas de juego y la persistencia
- Service worker propio (`public/sw.js`) y `app/manifest.ts`

## Estructura

```
app/
  page.tsx               # landing
  manifest.ts            # manifiesto PWA (start_url /app)
  app/                   # la aplicación (/app, /app/truco, …)
src/
  games/
    registry.ts          # lista única de juegos (inicio, barra inferior, landing)
    <juego>/             # model.ts (reglas puras + tests) y <Juego>Screen.tsx
  shared/
    game/                # nombres de jugadores y rondas, comunes a las planillas
    persistence/         # createGameStore: JSON versionado + caducidad
    hooks/               # usePersistentGame (autoguardado), wake lock, media queries
    ui/                  # tarjetas claymórficas, barras, grillas, campos, diálogos
  pwa/                   # registro del SW y botón/estado de instalación
public/
  sw.js  icons/
scripts/generate-icons.mjs
```

Cada juego es un módulo autocontenido: `model.ts` concentra las reglas (sin React) y la pantalla solo dibuja. La persistencia, el autoguardado y la grilla por rondas se escriben una sola vez y los comparten Chin Chon, 10 mil y Comodín.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # reglas de juego y persistencia
npm run lint
npm run build && npm start   # el service worker solo se registra en producción
npm run icons      # regenera los íconos PWA en public/icons
```

## Deploy

Pensado para [Vercel](https://vercel.com): importar el repo y desplegar, sin configuración extra (HTTPS es requisito de las PWA).

## Instalar

- **Android / Chrome, Edge (escritorio)**: en la landing tocá **Descargar la app**.
- **iPhone / iPad**: en Safari, **Compartir → Agregar a inicio**.

---

<div align="center">

Hecho con 🧉

</div>
