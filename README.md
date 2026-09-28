<div align="center">

# 🎲 Kounta

**Anotador de puntajes para tus juegos de cartas y dados favoritos.**

Truco · Generala · Chin Chon · 10 mil · Comodín

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)
![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)
[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

</div>

---

## ✨ Qué es

**Kounta** es una PWA (aplicación web instalable) para llevar el puntaje de partidas de cartas y dados sin lápiz, papel ni conexión a internet. Se instala desde el navegador en Android, iPhone y computadora, y funciona 100% offline.

Es la evolución de [**Kounta para Android**](https://github.com/mcodigo24/gamescounter) (Kotlin + Jetpack Compose): mismo diseño claymórfico oscuro ámbar/durazno, mismas reglas de juego, ahora sin depender de una tienda de aplicaciones.

Sin backend. Sin cuentas. Sin anuncios. Todo el estado vive en el dispositivo y se recupera automáticamente si cerrás la app a mitad de partida.

## 🎮 Juegos disponibles

| Juego | Descripción |
|---|---|
| 🃏 **Truco** | Marcador clásico Nosotros vs. Ellos, de 0 a 30 puntos. |
| 🎲 **Generala** | Planilla completa con hasta 12 jugadores, todas las filas (1 a 6, Escalera, Full, Póker, Generala, Doble Generala) y totales automáticos. |
| 🀄 **Chin Chon** | Planilla por rondas con valores positivos y negativos, total acumulado y aviso visual al llegar a 100+. |
| 🎯 **10 mil** | Planilla por rondas: se entra con 750 o más y se gana llegando exacto a 10.000, con podio. |
| 🃏 **Comodín** | Anotador genérico por rondas para cualquier otro juego, con nombre propio y puntajes negativos opcionales. |

## 🧩 Características

- **Instalable** — se agrega a la pantalla de inicio desde el navegador, sin App Store ni Play Store.
- **Sin conexión** — un service worker cachea la app entera; funciona 100% offline una vez instalada.
- **Autoguardado** — cada partida se persiste sola 30 segundos después del último cambio, y también al pasar la app a segundo plano.
- **Expiración automática** — las partidas guardadas sin actividad caducan solas después de 1 día, para arrancar siempre limpio.
- **Responsive** — pensada para teléfono en mano (con la barra inferior oculta en horizontal), tablet y escritorio.
- **Reinicio con confirmación** — nunca se pierde una partida por accidente.

## 🛠️ Stack técnico

- **[Next.js 16](https://nextjs.org)** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** — paleta y claymorfismo como tokens en `app/globals.css`
- **[Vitest](https://vitest.dev)** para las reglas de cada juego y la capa de persistencia
- **Service worker propio** (sin dependencias de terceros) + `app/manifest.ts` para la instalación
- `localStorage` como única persistencia — no hay backend ni base de datos
- Arquitectura de **vertical slices**: cada juego es autocontenido en `model.ts` (reglas) + `Screen.tsx` (UI)

## 📁 Estructura del proyecto

```
app/
├── page.tsx              # Landing de bienvenida ("/")
├── manifest.ts           # Manifiesto de la PWA (start_url /app)
└── app/                  # La aplicación
    ├── page.tsx          # Inicio: selector de juegos
    └── <juego>/page.tsx  # Una ruta por juego

src/
├── games/
│   ├── registry.ts       # Lista única de juegos (inicio, nav, landing)
│   └── <juego>/
│       ├── model.ts      # Reglas puras del juego (sin React) + tests
│       └── <Juego>Screen.tsx
├── shared/
│   ├── game/             # Nombres de jugadores y rondas, comunes a las planillas
│   ├── persistence/      # createGameStore: JSON versionado con expiración
│   ├── hooks/            # Autoguardado, wake lock, media queries
│   └── ui/                # Tarjetas, barras, grillas, campos y diálogos claymórficos
└── pwa/                  # Registro del service worker y botón de instalación

public/
├── sw.js                 # Service worker (cache-first / network-first)
└── icons/                # Íconos de instalación (generados con scripts/generate-icons.mjs)
```

Cada juego concentra sus reglas en `model.ts` (funciones puras, con tests) y su pantalla solo dibuja sobre ese estado. La persistencia, el autoguardado y la planilla por rondas se escriben una sola vez en `shared/` y las reutilizan Chin Chon, 10 mil y Comodín.

## 🚀 Cómo correrlo

Requiere [Node.js](https://nodejs.org) 20+.

```bash
git clone https://github.com/mcodigo24/kounta-pwa.git
cd kounta-pwa
npm install

npm run dev          # http://localhost:3000
```

Otros scripts:

```bash
npm test             # reglas de juego y persistencia (Vitest)
npm run lint         # ESLint
npm run build        # build de producción
npm start            # sirve el build (el service worker solo se registra acá)
npm run icons        # regenera los íconos PWA en public/icons
```

Para probar la instalación y el modo offline hace falta el build de producción (`npm run build && npm start`), ya que el service worker no se registra en `next dev`.

## ☁️ Deploy

Pensado para desplegarse en [Vercel](https://vercel.com): importar el repo y desplegar sin configuración adicional. HTTPS es requisito de las PWA, y Vercel lo provee por defecto.

## 📲 Instalar

- **Android / Chrome, Edge (escritorio)**: entrá a la landing y tocá **Descargar la app**.
- **iPhone / iPad**: abrí el sitio en Safari → **Compartir** → **Agregar a inicio**.

## 🔗 Proyecto relacionado

La versión original de Kounta es una app nativa de Android en Kotlin + Jetpack Compose: **[mcodigo24/gamescounter](https://github.com/mcodigo24/gamescounter)**.

## 📄 Licencia

[MIT](LICENSE) © Matías Melczer

---

<div align="center">

Hecho con 🧉

</div>
