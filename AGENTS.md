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
`src/data/query-client.ts`, database `src/data/db.ts`, loading, error and message states
`src/components/query-state.tsx` (`ErrorState` has `compact` for half a screen), type chip
`src/components/type-chip.tsx`, stat names and bar widths `formatStatName` and `statBarWidth` in
`src/lib/pokemon.ts` (`statBarWidth` is Detail's scale; Compare has its own, `compareBarWidth` in
`src/lib/compare.ts`, because strong Pokémon must stay apart there), Pokecard variants `PokemonCard`
(Row) and `PokemonListCard` (List) in `src/components/pokemon-card.tsx` (a card's image: `CardImage` there,
which tries `cardImageUrls` in order; Detail and Compare use `artworkUrl`), the screen title with the space
below it `GridTitle` in `src/components/pokemon-grid.tsx`, the top bar with back and the screen's own
actions `TopBar` and `TopBarButton` in `src/components/detail-top-bar.tsx`. Anything new that other
features will use gets a line here.

## Rules

- Every query on screen has a loading state and an error state with a **Try again** button. The one
  exception is the read of a single row behind the heart on Detail (`useIsFavorite`): it shows the
  outline until it answers, and a tap is the retry. Everything else that visibly loads keeps both
  states, including the Favorites list.
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
- **`expo-sqlite` and the web export:** without `assetExts.push('wasm')` in `metro.config.js` the web
  export no longer bundles, and iOS and Android do not need it. The docs also ask for COOP/COEP headers,
  but only the sync API uses `SharedArrayBuffer`: the async API we use runs fine on plain `http.server`.
  The data lives in the browser's OPFS per origin, so a new port starts with an empty database.
- **`http.server` has no clean URLs.** `/favorites` gives a 404 and `/favorites.html` matches no route,
  which shows the not-found screen and React error #418. Open `/` and click the tab.
- **"Can't perform a React state update on a component that hasn't mounted yet" at start on Android** is
  an open bug in expo-router, not our code: [expo/expo#50282](https://github.com/expo/expo/issues/50282).
  It is a race, so it comes and goes (about 1 launch in 4 on an empty template), and only in development.
  The tell is `useLinking.native.js:127` in the stack. iOS has a synchronous path and does not get it.
- **Web click-through, the Home search bar:** the floating tab bar of the web fallback lies over the
  middle of the bar, so click on the magnifier. A delay in the `fetch` wrapper needs at least 8 seconds:
  the browser tool is slow enough that a shorter one is over before the next step runs. `selectionColor`
  does nothing for the caret on web, so its colour can only be checked on a phone.
- **Figma heights are not what the code output suggests.** A stroke in Figma lies inside the box, a React
  Native border comes on top of it: padding 10 with a 2px line becomes padding 8 plus the border. Figma
  also rounds text boxes (14 × 1.25 → 18), so with the exact line height rows drift away. Compare with
  `get_metadata`, and measure the web export with `getBoundingClientRect`; on web only the 44px status
  bar is missing from every `y`.
- **An SF Symbol in Figma is a text node** (`chevron.left` on Detail), so it has no icon asset, and the
  icon `Back` is a different shape. `download_assets` with `defaultFormat: 'svg'` on that text node gives
  the outlined path, which can be rasterized like the other icons.
- **`accessibilityState` does not reach the web.** `aria-selected` works on both web and native, so it can
  be checked in a web export.
- **A request that fires after a tap needs no change to `index.html`:** patch `window.fetch` with the
  browser tool once the list has loaded, then tap. The `index.html` trick is only for the first request.
- **Anything local needs `networkMode: 'always'`.** By default TanStack pauses queries and mutations
  while offline, also when they never touch the network. Tested on web: without it, tapping the heart
  while offline did nothing.
- **Does a Figma value follow a rule? Work it out before you copy it.** The Stats bars look exact, but
  they run from 2.26 to 3.00 px per point and Charmander's Speed says 50 where the API gives 65: sample
  data, so no formula matches them. I recommended value / 255; Mats chose value / 114, the closest to
  Figma, even though everything from 114 up is then a full bar. Also add up the tallest tab against
  Figma's frame: Stats scrolled 10 px on 844 until the gap below it became Figma's 14 (`Detail.bottomGap`).
- **Opening any route in a running web export:** `history.pushState({}, '', '/pokemon/242')` followed
  by `dispatchEvent(new PopStateEvent('popstate', { state: {} }))`. This saves searching for a Pokémon
  that is far down the list. Open `/` first: see the lesson on clean URLs.
- **A screenshot right after a click can show the old frame.** The DOM had switched to Stats while the
  screenshot still showed About. Wait a second, or measure with `getBoundingClientRect`. Reading the DOM
  in the same batch as the click can be too early as well: a spinner after Try again looked absent until
  a one-second wait was added.
- **Add up Figma's bottom per tab, it is not one rule.** Stats ends 14 above the home indicator, the last
  card on Evolution runs 8 into it (26 from the edge). `insets.bottom + 14` looked the same at rest and
  scrolled 22 px on 844; Mats follows Figma, so Evolution has its own padding. An inset above Figma's 34
  is a row of Android buttons, and the card stays above that.
- **Comparing an icon with Figma:** unlike `get_screenshot`, `download_assets` with `defaultFormat: 'png'`
  and `defaultScale` does render at 2x and 3x. That export has Figma's grey page colour (`#E5E5E5`)
  behind the icon, so put your own PNG on that colour and compare per channel, not per alpha. A Figma
  path can also contain `H` and `V`, so a small rasterizer has to handle those as well.
- **In a hidden browser pane images may not load until you take a screenshot.** `tabs_context` says
  whether the pane is hidden. An image stayed at `naturalWidth` 0 for 6 seconds, and while it waits
  `expo-image` keeps the old `<img>` next to the new one, so the first `img` in the DOM is the old one. It
  looked like a heart that stayed empty. Take a screenshot first, then read the last `img`.
- **Colours read from a pane screenshot are not exact, also through `zoom`:** `#FF4F68` read as
  (231, 93, 108); I did not find out why. For an exact colour, draw the image on a canvas with the
  element's own `filter` and use `getImageData`.
- **Haptics on web:** `impactAsync` calls `navigator.vibrate`, with `[40]` for Light. Replace that function
  with a counter to check the number of taps per toggle. What it feels like still needs a phone.
- **The native tab bar on the web fallback shows no icons,** only labels (`NativeTabsView.web.js`), and every
  tab mounts at page load (`forceMount`). So tab icons are checked as PNGs against Figma and then on a phone,
  `find` also returns text from the hidden tab, and a test switch for a tab's first load has to be set before
  the page loads.
- **Tab label fonts on Android:** Rubik here too, although Figma has SF Pro: the course rule goes first. The
  bar takes one family for both states, from `labelStyle.default`;
  `selected.fontFamily` only reaches iOS. The lookup goes through `ReactFontManager`, where `expo-font` registers
  each file as the normal style, so a `fontWeight` of 700 misses it and gives the system font. Family only, no weight.
- **Testing an SQLite failure on web:** a temporary `sessionStorage` switch in `listFavorites`, exported to a
  throwaway folder and restored straight after the export. A new port means a new origin, so an empty database.
- **Check that `http.server` really started.** Port 8765 was held by another process here, which answered with
  HTTP 426. Check `netstat` first, and compare the bundle name in `index.html` with your export.
- **In a hidden browser pane `innerWidth` is 0,** so every measurement is wrong without any error: the heart
  on Detail measured x 96 instead of 342. Call `resize_window` with 390x800 first (Figma's 844 without the
  status bar that web lacks), and only compare numbers that were measured at that size.
- **`router.dismissTo` updates the params of the screen it returns to.** The docs do not say so and the source
  only shows `POP_TO`, so this is measured on web: `/compare?a=4` became `/compare?a=4&b=7`, with Search gone
  from the stack. On a phone it still has to be seen.
- **Many Pokémon tie on stats won.** Charmander vs Squirtle and Charizard vs Blastoise are both 3 each, so they
  cannot test a winner; Bulbasaur vs Pikachu gives "Bulbasaur wins 4 of 6 stats". Its total goes to Pikachu
  (318 and 320), which shows that the verdict and the total are two different things.
- **`expo-image` cannot scale without smoothing, Figma can.** The docs have no option for it. iOS sets
  `.trilinear` in `ImageView.swift`, Android draws with `BitmapDrawable`'s default `FILTER_BITMAP_FLAG`, and React
  Native's `Image` is trilinear on iOS too. Figma's 3x export of a sprite is close to nearest neighbour, so cards are
  softer than Figma (read from the source, not seen on a phone). Skia's `FilterMode.Nearest` is the one way in Expo
  Go, at the price of a package and a canvas per card. `CardImage` is the only component that would change.
- **Comparing with Figma's source images:** `rawImages` in `download_assets` gives the originals, also for the
  instances on a screen, in no fixed order. Decode them and hash the pixels against your candidates: that is how
  the cards turned out to be exactly `sprites/pokemon/{id}.png`. The folder has 96x96 files only; the PNG header
  (first 24 bytes) gives the size without downloading the file.
- **A failed `expo-image` does not try again by itself,** not after a re-render and not when the network returns,
  only with a new source or a new mount (Android keeps `loadedSource`, iOS reloads on a change of props or size).
- **An optimistic target comes from the cache, not from the rendered value.** `onMutate` changes the cache before
  the next tap can arrive, while the screen renders later (about 60 ms in a web export). With `!isFavorite` from
  the render, two taps 17 ms apart both sent `remove`. Testing this: two `left_click`s in a `browser_batch` land
  anywhere from 17 to 600 ms apart, a `double_click` about 3 ms, so read the times and do not assume the case ran.
- **Testing an optimistic update on web:** a `MutationObserver` on `aria-label` logs every change of the heart with
  its time, including a flash too short for a screenshot. Put a delay and a log in the repository with the temporary
  `sessionStorage` switch. Open Detail by tapping a card: after `pushState` on a fresh page the tabs are not
  mounted and back does nothing. Do not call a global test helper `status`: `window.status` is a string.
- **Testing a failing image on web:** at runtime, wrap `HTMLImageElement.prototype.src` and `Element.prototype.setAttribute`
  so image URLs point to a dead address while a flag is on. In a search test, a letter that changes the results can
  change a row of the `FlatList` and so remount the card; a trailing space re-renders it without a remount.
- **Expo Go in the stores only supports the latest SDK.** When a new one ships, a project on the previous SDK gets
  "project is incompatible" on scanning. `https://api.expo.dev/v2/versions/latest` gives `expoGoSdkVersion` and,
  under `sdkVersions`, the client download per SDK (`androidClientUrl`, `iosClientUrl`). Check it before a hand-in.
- **`expo install --fix` across an SDK can stop on `ERESOLVE`, while the new versions are fine.** Here npm refused
  `expo-router` 58 because the old lockfile and `node_modules` still held `expo-symbols` 57. To tell the two apart,
  resolve the new `package.json` in an empty folder with `npm install --package-lock-only`. If that works, take that
  lockfile and run `npm ci`. Do not use `--force`: whoever clones the repo needs a plain `npm install` to work. A
  fresh lockfile also moves everything else in its range, so hold a direct package you did not mean to change by
  pinning it for the first run and restoring the range for a second (TanStack Query would have gone to 5.106). The
  failed second round also leaves `@types/react` and `eslint-config-expo` behind, and `expo` keeps the literal
  `^58.0.0`; set those by hand and confirm with `npx expo install --check`.
- **In a hidden pane with an emulated size, screenshot coordinates are not CSS pixels:** the frame was 800x600 for a
  page of 390x800, and clicks on Detail's tabs read from it missed without an error. `ref` clicks use CSS pixels, so
  use those. The exception is the Home search bar: its `ref` centre lies under the web tab bar (see the lesson above).
