This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

---

# This project: Pokédex

What the app does: `specs/product.md`. One spec per feature in `specs/features/`. The design is the
course Figma file (link in `specs/product.md`); follow it strictly.

## Structure: UI, data and logic are not mixed

- `src/app/`: routes only. A screen composes components and hooks; no `fetch`, no SQL, no calculations.
- `src/components/`: presentational UI. Props in, JSX out. No data fetching.
- `src/data/`: everything that talks to the outside world. `pokeapi.ts` (fetch + response types),
  `db.ts` (SQLite open + migrations), `favorites-repository.ts` (all SQL), and `queries/` with the
  TanStack Query hooks that screens use.
- `src/lib/`: pure functions (formatting, unit conversion, filtering, comparing). No React, no imports
  from `src/data/`.
- `src/constants/theme.ts`: the only place for colours, spacing, radii and font sizes. No hex codes elsewhere.

## Rules

- Every query on screen has a loading state and an error state with a **Try again** button.
- Types for API responses live in `src/data/pokeapi.ts`. No `any`.
- `npx expo lint` and `npx tsc --noEmit` must both be clean before a commit.
- Add packages only with `npx expo install`, and only when the issue's plan names them.

## Figma

Working copy of the course design, readable with the Figma MCP: fileKey `yM5t2yGQQ279kiKIwfYyTH`
([link](https://www.figma.com/design/yM5t2yGQQ279kiKIwfYyTH/Pokemon-Code-Challenge--Copy-)).
Build from the **iOS** row of page *Mobile* (`0:1`), 390x844:

| Screen | node |
|---|---|
| Splashscreen | `1:70` |
| Home | `1:2` |
| Search | `1:27` |
| Detail (About / Stats / Evolution) | `1:15007`, `1:15159`, `1:15224` |
| Detail - scroll | `1:3814` |
| Favorites | `1:15076` |
| Options | `15:4515` |

Components on page *Components* (`1:13852`): Pokecard `1:14698`, Type chip `447:2508`, Tabs `1131:2631`,
Menu `15:2827`. Type colours: page *Types* (`447:2497`). Icons: page *Icons* (`1:13808`), incl. Favorite,
Share iOS/Android, Back, Search. Use `get_design_context` / `get_screenshot` on these ids; copy exact
colours, sizes and spacing into `theme.ts`, not into components. Ignore the Web, SmartTV and Tablet pages.

## Workflow: one issue per chat

1. **Read** the issue and the spec it links to. Read the files the issue touches.
2. **Plan**: post a plan and a task list as a comment on the issue
   (`gh issue comment <n> --body-file <file>`). Files to touch, approach, risks. Then **stop and wait**
   for the user to approve it in the chat.
3. **Build** the task list, one item at a time.
4. **Check**: lint and typecheck clean; walk through every acceptance criterion of the issue and say
   per criterion how it was verified.
5. **Explain** in the chat what changed and why, in a few lines, so the user can explain it too.
6. **Commit and push**: message `<short summary> (closes #<n>)`. Never force-push, never squash.
7. **Learn**: anything that surprised you or went wrong goes under *Lessons* below, in the same commit.

## Lessons

<!-- Grows per issue: things the agent got wrong or had to learn about this project. -->
- **Figma type colours are not variables.** The chips on page *Types* only carry a raw fill on the
  12px dot SVG. `get_variable_defs` returns `{}` there; download the dot SVGs from
  `get_design_context` and read `fill=` instead. Page *Types* has all 18 types plus Unknown and Shadow.
- **Figma icons as PNG:** `get_screenshot` does not upscale past the node size (24px stays 24px), and
  there is no SVG rasterizer on this machine. The tab icons were rasterized with Python/PIL from the
  SVG paths (black on transparent, `renderingMode="template"` tints them). Reuse that for new icons.
- **Checking the app without a phone:** `npx expo start --web` hung on "Starting Metro Bundler" in the
  preview pane. `CI=1 npx expo export --platform ios --platform android` proves it bundles, and
  `--platform web` plus `python -m http.server` gives a page you can click through. On web
  NativeTabs is a floating bar at the top; that is expo-router's web fallback, not a bug.
