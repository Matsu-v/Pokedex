# Pokédex

Final assignment React Native, Inholland. A Pokédex on live data from [PokeAPI](https://pokeapi.co/),
built with Expo, Expo Router, TanStack Query and SQLite.

- What the app does: [`specs/product.md`](./specs/product.md), one spec per feature in [`specs/features/`](./specs/features/)
- Instructions for the coding agent: [`AGENTS.md`](./AGENTS.md)
- Work is split into [GitHub Issues](../../issues), each closed by a commit
- Agent chats: [`chat-history/`](./chat-history/) · Explanation: [`docs/toelichting.md`](./docs/toelichting.md)

## Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. Wi-Fi blocks it? `npx expo start --tunnel`.

## Checks

```bash
npx expo lint
npx tsc --noEmit
```
