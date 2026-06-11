## Setup Game

Setup to start new game project with atom-engine

### Start vite project

```sh
pnpm create vite@latest box-game -- --template vanilla
```

### Install atom-engine

```sh
pnpm add atari-monk-atom-engine
```

### Page

- Remove vite boilerplate

- Add box favicon.png

![Box](../../images/favicon.png)

### Implementation

Implement main page, basic player, game and main entrypoint to setup game

See [Implementation](implementation/setup-game.md)

### Sounds

- Add folder `sounds`
- Add `*.mp3`, `*.wav`

### Demo

- Add folder `demo`
- Feature snapshot for runtime test in isolation
- Procedural game and oop wrapper specific for feature
- Substitute Game in `main.ts` with demo to test feature