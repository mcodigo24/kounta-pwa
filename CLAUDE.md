@AGENTS.md

## Project

Kounta — PWA (Next.js 16 App Router + React 19 + TypeScript) for scoring 5 card/dice games: **Truco**, **Generala**, **Chin Chon**, **10 mil**, **Comodín** (generic scorer). Client-only, no backend — `localStorage` is the only persistence. This is the web port of [mcodigo24/gamescounter](https://github.com/mcodigo24/gamescounter) (native Android/Kotlin/Compose): same claymorphic dark amber/peach design, same rules, all UI text in Spanish.

Two route trees: `/` is the marketing landing (install CTA, game list), `/app` is the actual PWA (`app/manifest.ts` sets `start_url: "/app"`).

## Commands

```bash
npm run dev          # next dev (Turbopack). The service worker does NOT register here.
npm run build         # production build
npm start             # serve the build — required to test install/offline (SW only registers in production)
npm test              # vitest run — game rules + persistence
npm run lint
npm run icons          # regenerate public/icons/* from scripts/generate-icons.mjs (needs `sharp`)
```

## Architecture

Each game is a **vertical slice** under `src/games/<game>/`:

- `model.ts` — pure functions and types: state shape, constants, rules (clamping, win/lose, totals). No React, no I/O. This is where game logic lives and where `model.test.ts` covers it.
- `<Game>Screen.tsx` — the client component. Wires `model.ts` to `usePersistentGame`, renders with the shared UI kit, owns local-only UI state (dialogs open, `lastEditedCell`, etc.) that isn't persisted.

Registered once in `src/games/registry.ts` (id, title, subtitle, longer `about` copy, icon, href) — this is the single source the home screen, bottom nav, and landing page all read from. Adding a game means adding an entry here plus the model/screen/route.

### Shared engine (`src/shared/`)

- `game/players.ts` — `normalizePlayerName` (uppercase, A-Z/0-9, max 3 chars), `nextUnusedLetter`, `resizeInitials`, `sanitizeInitials`.
- `game/rounds.ts` — the round-sheet primitives used by Chin Chon, 10 mil, and Comodín: `emptyRound`, `ensureTrailingEmptyRound` (always exactly one empty trailing round, and trims extra empty ones), `parseCellInput` (`""`/`"-"` → null, else must be a plain integer), `setCell`, `sumColumn`.
- `persistence/gameStore.ts` — `createGameStore({ key, version, sanitize })`: JSON envelope in `localStorage` with a `lastUpdated` timestamp and 24h TTL (`SAVE_RETENTION_MS`). `sanitize` must validate/normalize whatever comes back (bump `version` on shape changes — old data is then ignored, not migrated).
- `hooks/usePersistentGame.ts` — `{ state, update, reset, saveStatus }`. `update(fn)` applies `fn` to the latest state (not the last-rendered one, so several updates in one tick compose correctly), debounces a save 30s (`AUTO_SAVE_DELAY_MS`), and flushes on `visibilitychange`→hidden / `pagehide`. Mount only on the client (state is read from `localStorage` synchronously in `useState`'s initializer) — routes wrap game screens in `<ClientOnly>` for this reason.
- `hooks/useKeepScreenAwake.ts` — Screen Wake Lock API, 40s from the last change to `resetKey`, released on unmount.
- `hooks/useMediaQuery.ts` — `useIsLandscape()` (phone landscape ⇒ hide bottom nav / compact top bar, mirrors the Android orientation handling) and `useIsClient()`.
- `ui/` — the claymorphic kit: `Clay.tsx` (`KountaCard`, `KountaSection`, `KountaPrimaryButton`, `.clay` CSS class for the dual box-shadow), `GameTopBar.tsx`, `RoundGrid.tsx` (generic round-sheet grid shared by Chin Chon/10 mil/Comodín — Generala has its own grid, different metrics), `ScoreFields.tsx` (`PlayerInitialField`, `SignedScoreField`, `UnsignedScoreField`, `GridLabel`, `GridTotalCell`), `Dialogs.tsx`, `PlayerSetup.tsx`, `BottomNav.tsx`, `Icon.tsx` (inline SVGs, no icon font/library), `ClientOnly.tsx`.

### PWA (`src/pwa/`, `public/sw.js`)

- `ServiceWorkerRegister.tsx` registers `public/sw.js` — a hand-written SW (no Serwist/next-pwa), production-only. It precaches the app shell + per-game routes and their `/_next/static` assets on install, then serves `/_next/static/*` cache-first and everything else network-first with a cache fallback (offline navigations fall back to the `/app` shell). Bump `VERSION` in `sw.js` to invalidate old caches on a deploy.
- `install.ts` / `InstallButton.tsx` — wraps `beforeinstallprompt` (Android/Chrome/Edge) and detects iOS (shows manual "Compartir → Agregar a inicio" instructions) and standalone mode (already installed).

## Conventions / gotchas

- All persisted keys are namespaced `kounta:<game>` (e.g. `kounta:truco`) with a `version` field in the envelope — see `sanitize*` functions per game's `model.ts` for what a valid restore looks like.
- Game screens that have a setup step (Chin Chon, 10 mil, Comodín) render `<PlayerSetup>` when `state.isConfigured` is false; Truco and Generala have no setup screen (fixed/default player count).
- Round-based games always keep exactly one trailing empty round in `rounds` (`ensureTrailingEmptyRound`) so the grid always has a blank row ready to type into — don't hand-roll this elsewhere.
- Text is Spanish and user-facing strings live inline in the screens (not extracted to a strings file) — match existing spelling/accents when editing (the original Android app was inconsistent here; this port fixed it, keep it consistent).
- When porting a new bugfix/rule from the Android app, check `src/games/<game>/model.test.ts` first — the intentional deviations from the original Android behavior (10 mil's 750-entry retry, Chin Chon's re-entry seeding) are documented there and in code comments.
