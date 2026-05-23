[pl](pl/bootstrap.md)

## Bootstrap light engine

To bootstrap a light engine game, you need to initialize it and set it up in the main application entry point.

### Game

The game is procedural. The main structure is `GameState`.

`GameState` contains core light-engine components:

* `Renderer`
* `Input`
* `Audio`

The `createGame` function initializes and returns a `GameState` instance.

The `updateGame` function takes `GameState` and `dt` (delta time in seconds).
It is called every frame and is responsible for updating game logic.

The `renderGame` function takes `GameState` and `alpha` (interpolation factor).
It clears the screen using the renderer and draws the current frame.

The `startGameMusic` function starts background music using the engine audio component.

```ts
{{include:src/game.ts}}
```

#### OOP Wrapper

The game also provides a thin OOP wrapper around the procedural core.

It implements the `IGame` interface, which is the engine’s standard game API.
This wrapper is a convenience layer over the procedural `GameState`.

```ts
export interface IGame {
    update(dt: number): void;
    render(alpha: number): void;
}
```

The wrapper encapsulates `GameState`, initializes the game, and exposes public methods:

* `update`
* `render`
* `startMusic`

```ts
{{include:src/oop/game.ts}}
```

## Main

The main application file is responsible for engine initialization and game startup.

It performs the following steps:

1. Creates core engine components:

   * `Renderer`
   * `Input`
   * `Audio`

2. Loads required audio assets into the audio system.

3. Creates the game wrapper instance (`Game`).

4. Handles the user interaction overlay:

   * Modern browsers require a user gesture before playing audio.
   * The overlay click hides the start screen, shows the canvas, and starts music using `playMusicAfterGesture`.

5. Initializes and starts the game loop using `GameLoop`.

```ts
{{include:src/main.ts}}
```

## Sounds

The `sounds` folder contains audio assets used by the game.

The engine audio component supports common formats such as `.wav` and `.mp3`.

Audio is loaded asynchronously before playback and is referenced by a string key (e.g., `"bg"`, `"move"`).

---

## Notes / Clarifications

### Game loop behavior

The engine `GameLoop` is responsible for:

* Calling `update(dt)` with fixed or semi-fixed timestep logic
* Calling `render(alpha)` for interpolation between frames

This separation ensures smooth rendering even when update steps vary.

### Audio autoplay restrictions

Modern browsers block audio playback without user interaction.
That is why `playMusicAfterGesture` is used inside the overlay click handler.

### Separation of concerns

* `GameState` → procedural logic container
* `Game` class → thin OOP adapter for engine compatibility
* `main.ts` → bootstrapping, asset loading, and lifecycle orchestration

### Renderer responsibility

The renderer is expected to clear and draw frames.
Higher-level drawing logic should remain inside `renderGame`, not in `main.ts`.