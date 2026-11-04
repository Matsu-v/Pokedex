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

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules, and this app must run in it. Use only libraries that work in Expo Go; never switch to a development build to make a library work.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

---

# This project: Pokédex

What the app does: `specs/product.md`. One spec per feature in `specs/features/`. The design is the
course Figma file (link in `specs/product.md`); follow it closely. The course's requirements are in
`exam/README.md` of the course repo, appendix A for this route. `specs/optional/` is only built when
the user asks for it.

The app must run in **Expo Go**: the teacher clones the repo, runs `npx expo start` and scans the QR
code. No library that needs a development build.

## Structure: UI, data and logic are not mixed

- `src/app/`: routes only. A screen composes components and hooks; no `fetch`, no SQL, no calculations.
- `src/components/`: presentational UI. Props in, JSX out. No data fetching.
- `src/data/`: everything that talks to the outside world. `pokeapi.ts` (fetch + response types),
  `db.ts` (SQLite open + migrations), `favorites-repository.ts` (all SQL), and `queries/` with the
  TanStack Query hooks that screens use.
- `src/lib/`: pure functions (formatting, unit conversion, filtering, comparing). No React, no imports
  from `src/data/`.
- `src/constants/theme.ts`: the only place for colours, spacing, radii, font sizes and fonts. No hex codes elsewhere.

Shared setup is reused, never added a second time: API client `src/data/pokeapi.ts`, query client
`src/data/query-client.ts`, database `src/data/db.ts`. Anything new that other features will use gets
a line here.

## Rules

- Every query on screen has a loading state and an error state with a **Try again** button.
- Types for API responses live in `src/data/pokeapi.ts`. No `any`, no `as` casts (`as const` is fine), no `@ts-ignore`, no `console.log`.
- Fonts come from `Fonts` in `theme.ts`, loaded with Expo Font. The course's font is Rubik; no new font family without asking.
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
2. **Plan**: post a plan and a `- [ ]` task list as one comment on the issue
   (`gh issue comment <n> --body-file <file>`). Files to touch, approach, risks. Then **stop and wait**
   for the user to approve it in the chat.
3. **Build** the task list, one item at a time, and tick off each task in that comment
   (`gh issue comment <n> --edit-last --body-file <file>`).
4. **Check**: lint and typecheck clean; walk through every acceptance criterion of the issue and say
   per criterion how it was verified.
5. **Explain** in the chat what changed and why, in a few lines, so the user can explain it too.
   When the user rejected or changed a suggestion, say so plainly: `docs/explanation.md` asks for one.
6. **Commit and push**: message `<short summary> (closes #<n>)`. Never force-push, never squash.
7. **Learn**: anything that surprised you or went wrong goes under *Lessons* below, in the same commit.

## Lessons

<!-- Grows per issue: things the agent got wrong or had to learn about this project. -->
- **Lint reports unresolved modules after an install?** `npx expo lint` can read a stale cache from
  `.expo/cache/eslint`. Check with `npx expo lint --no-cache` before looking for a real problem.
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
- **Check the branch base first.** A worktree can be created before the previous issue is merged; this
  one started on the old starter while #1 was already on `origin/main`. `git fetch` and fast-forward
  before planning, otherwise the plan is built on files that no longer exist.
- **Checking pure code without a test runner:** Node 22 runs `.ts` directly (`node check.ts`). Copy the
  files under test to the scratchpad and import them with a relative `./x.ts` path; the `@/` alias
  does not resolve outside Metro. Works for `src/lib/` and for `src/data/pokeapi.ts` against the live API.
- **Font is Rubik, loaded with `useFonts` in the root layout** (works in Expo Go and on web; the
  config-plugin route needs a dev build and gives different family names per platform). Use
  `Fonts.medium` etc. from `theme.ts` as `fontFamily` and set no `fontWeight`: on Android a weight
  next to a custom family picks the wrong file.
- **expo-image `transition` gets stuck on web:** the cross-dissolve stays at opacity 0 for most
  images (the `<img>` loads, nothing shows). No fade on artwork; check web with
  `getComputedStyle(img).opacity`, not only with `naturalWidth`.
- **Clicking through a web export:** a synthetic `el.click()` does not fire a `Pressable`, and the
  export strips `console.log`. Click with the browser tool by `ref` and record taps in a global
  (`globalThis.taps`) in a temporary screen. Export to a new folder each time: the folder that
  `http.server` is serving is locked on Windows.
- **Everything is in Rubik, also where Figma differs.** Figma has Cabinet Grotesk Extrabold for titles
  (also the name on Detail, at 32px) and Inter in the search bar. The course's font is Rubik, so Mats
  chose Rubik everywhere: use `Fonts.title` for titles and `Fonts.regular` for the search bar. Should
  this change: Cabinet Grotesk's licence (ITF FFL, section 02) forbids the file in a public repo, so it
  was loaded from Fontshare's CDN with `useFonts`; see commit c1d8a5b.
- **A worktree's `node_modules` goes stale.** After a fast-forward it can miss packages from earlier
  issues (`@tanstack` was gone here, while `package.json` had it). Run `npm ci` before building.
- **Keep room for the next-page spinner.** A footer that renders only while loading starts below the
  edge of the screen when you are at the end of the list, so you never see it. `LoadMoreFooter` keeps
  the space of the stopped spinner for as long as there is a next page.
- **Testing failed requests in a web export:** the first request fires before the browser tool can
  patch `fetch`. Put a `<script>` that wraps `fetch` at the top of `index.html` in the throwaway export,
  with flags in `sessionStorage`; that covers a slow or failing first load and next page. This is not
  the same as being offline on web: TanStack's `onlineManager` then pauses the query instead of failing
  it (read from the source, not run). React Native has no such event, so there the request fails.
- **`ETARGET` on a version that exists:** after registry timeouts npm falls back to its stale cached
  package list, which may not have the version yet. Check with `npm view <pkg>@<version>` and run the
  same command again; it is not a version conflict, so no `--force`. `npx expo install --fix` also runs
  in two rounds (first `expo`, then the rest), so a failed second round leaves `package.json` updated
  and those packages not installed. Read the real exit code: `| tail` hides it.
- **`expo install --fix` can leave a range behind.** A package that npm already moved along with `expo`
  counts as fine, so its range stays old (`expo-constants` stayed `~57.0.19` with 57.0.22 installed).
  `npx expo install <pkg>` brings the range in line.
- **Check port 8081 before you scan.** An `expo start` from another worktree can still hold it, and its
  QR code opens that branch. Use `--port 8082`. This PC has several network adapters, so set
  `REACT_NATIVE_PACKAGER_HOSTNAME` to the LAN address, otherwise the QR code may point to an address
  the phone cannot reach.
