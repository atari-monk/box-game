[pl](pl/rect.md)

## Rect module documentation (`src/rect.ts`)

The `rect` module defines a simple, framework-agnostic rectangle primitive built around a plain data structure (`RectState`) and two utility functions for creation and rendering.

### `RectState`

```ts
export type RectState = {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
};
```

Represents a rectangle in 2D space:

* `x`, `y` — top-left position on canvas
* `width`, `height` — size of the rectangle
* `color` — fill color used during rendering

This is a **pure data model** with no behavior.

---

### `createRect(...)`

```ts
export function createRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color = "white"
): RectState
```

Factory function that creates a `RectState`.

* Provides a default color (`white`)
* Keeps object creation consistent and centralized
* Useful for ensuring all rectangles follow the same shape contract

---

### `renderRect(rect, ctx)`

```ts
export function renderRect(
    rect: RectState,
    ctx: CanvasRenderingContext2D
)
```

Renders a rectangle onto a canvas.

* Uses `ctx.fillStyle` to apply color
* Draws via `ctx.fillRect(x, y, width, height)`
* No side effects beyond drawing
* Purely presentation-layer logic

This separation makes rectangles reusable across different architectures (functional, ECS, OOP wrapper).

---

## OOP wrapper (`src/oop/rect.ts`)

The `Rect` class is a thin object-oriented wrapper around the functional `RectState`.

### Purpose

* Wraps state (`RectState`) inside a class
* Exposes controlled access via `state` getter
* Reuses functional logic (`createRect`, `renderRect`) instead of duplicating it

### Key idea

This is **not a full OOP rewrite**, but a lightweight adapter layer:

* Keeps data immutable-ish (state is private)
* Delegates creation to `createRect`
* Delegates rendering to `renderRect`

### Structure

```ts
class Rect {
    private _state: RectState;

    get state()
```

* `_state` holds the actual rectangle data
* `state` exposes read access (but no mutation API in current design)

### Behavior

```ts
render(ctx: CanvasRenderingContext2D)
```

* Calls shared `renderRect`
* Ensures consistency between functional and OOP usage

### Summary

This wrapper exists mainly for **integration with object-based game architecture**, not to introduce complex encapsulation.

---

## Game-dev rig (`src/game-dev.ts`)

The `GameDev` module is a lightweight testbed for integrating new entities and verifying gameplay systems.

### Purpose

It acts as a **sandbox game state container**, combining:

* Engine systems (`Renderer`, `Input`, `Audio`)
* Gameplay entities (`Player`, `Rect`)
* Update/render orchestration

### GameState composition

```ts
export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
    rect_a: Rect;
    rect_b: Rect;
};
```

This setup allows quick testing of:

* Player movement + interaction
* Rendering multiple entity types
* Audio triggers from gameplay events
* Entity layering and ordering on canvas

---

### Initialization (`createGame`)

```ts
rect_a: new Rect(400, 200, 120, 80, "blue"),
rect_b: new Rect(540, 200, 120, 80, "blue")
```

Two rectangles are spawned as static test entities:

* Used as **visual anchors**
* Useful for testing collision space, alignment, and rendering order
* Helps verify entity system scaling beyond the player

---

### Update loop (`updateGame`)

```ts
const moved = state.player.update(dt, state.input);

if (moved) {
    state.audio.play("move");
}
```

Responsibilities:

* Updates player based on input
* Detects movement state
* Triggers audio feedback on movement

This makes it a good minimal test for:

* input → state → feedback pipeline
* audio triggering correctness
* delta-time movement logic

---

### Render loop (`renderGame`)

```ts
state.renderer.clear();

state.rect_a.render(state.renderer.ctx);
state.player.render(state.renderer.ctx, alpha);
state.rect_b.render(state.renderer.ctx);
```

Rendering order:

1. Clear screen
2. Draw static rectangles (background/test objects)
3. Draw player (intermediate layer with interpolation via `alpha`)
4. Draw second rectangle (foreground test object)

This setup is intentionally simple but useful for:

* verifying z-order rendering
* testing interpolation rendering (`alpha`)
* validating multiple entity composition

---

## Game vs GameDev switch (`src/main.ts`)

### Current structure

```ts
const game = new GameDev(renderer, input, audio);
```

The app currently uses **GameDev as the active runtime game**.

### Role of the switch

There is an implied architectural split:

* `Game` → production or “final” game implementation
* `GameDev` → experimental / integration test environment

---

### Why this exists

This pattern allows:

* rapid prototyping of new entities (like `Rect`, `Player`)
* safe testing without breaking main game logic
* comparison between experimental and stable versions

---

### In `main.ts`

The game loop is decoupled:

```ts
(dt) => game.update(dt),
(alpha) => game.render(alpha)
```

So swapping implementations is trivial:

```ts
const game = new Game(renderer, input, audio);
```

or

```ts
const game = new GameDev(renderer, input, audio);
```

---

### Summary

* `GameDev` is the **integration sandbox**
* `Game` is the **final runtime version**
* `main.ts` acts as a **switchboard for execution target**

This design supports iterative development without coupling experiments to production logic.