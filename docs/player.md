[pl](pl/player.md)

# Basic/Prototype Player Documentation

This document explains how the **Player system** works in the engine, covering both the procedural implementation and the OOP wrapper, as well as how it is integrated into the game loop.

---

# 1. Overview

The Player is a simple 2D entity that:

* Moves using arrow key input
* Has a fixed movement speed
* Is rendered as a red square
* Supports interpolation for smooth rendering between frames
* Triggers movement audio feedback via the game layer

The implementation is split into:

* **Procedural API (`src/player.ts`)** — core logic and state functions
* **OOP Wrapper (`src/oop/player.ts`)** — class-based abstraction
* **Game Integration (`src/game.ts`)** — connects player to renderer, input, and audio systems

---

# 2. Player State

```ts
export type PlayerState = {
    x: number;
    y: number;

    prevX: number;
    prevY: number;

    speed: number;
    size: number;
};
```

### Fields

* **x, y** → current position
* **prevX, prevY** → previous position (used for interpolation)
* **speed** → movement speed in pixels per second
* **size** → size of the rendered square

---

# 3. Procedural Player API

## 3.1 Creating a Player

```ts
createPlayer(x?, y?, speed?, size?)
```

Creates and returns a new player state.

### Defaults:

* x = 100
* y = 200
* speed = 200
* size = 50

### Example:

```ts
const player = createPlayer(150, 300);
```

---

## 3.2 Updating the Player

```ts
updatePlayer(state, dt, input): boolean
```

Updates player position based on keyboard input.

### Input Handling

The player uses arrow keys:

| Key        | Direction |
| ---------- | --------- |
| ArrowRight | +X        |
| ArrowLeft  | -X        |
| ArrowUp    | -Y        |
| ArrowDown  | +Y        |

### Movement Behavior

* Movement is normalized → diagonal movement is not faster
* Movement is frame-rate independent (`dt` is applied)
* Speed scales final movement

### Internal Steps

1. Store previous position
2. Read input and build direction vector `(dx, dy)`
3. Normalize vector (if moving)
4. Apply movement:

   ```ts
   state.x += dx * state.speed * dt;
   state.y += dy * state.speed * dt;
   ```
5. Return:

   * `true` → player moved
   * `false` → no input detected

### Example:

```ts
const moved = updatePlayer(player, dt, input);

if (moved) {
    console.log("Player moved");
}
```

---

## 3.3 Rendering the Player

```ts
renderPlayer(state, ctx, alpha)
```

Renders the player as a **red square**.

### Key Feature: Interpolation

Instead of directly rendering `x/y`, the player uses interpolation:

```ts
interpolated = prev + (current - prev) * alpha;
```

This smooths movement between update ticks.

### Rendering Steps

1. Compute interpolated position:

   * `interpolatedX`
   * `interpolatedY`
2. Set fill color to red
3. Draw square using `fillRect`

### Example:

```ts
renderPlayer(player, ctx, alpha);
```

---

# 4. OOP Wrapper (Player Class)

File: `src/oop/player.ts`

The `Player` class wraps the procedural API into an object-oriented interface.

## 4.1 Purpose

* Encapsulates `PlayerState`
* Provides clean integration with game systems
* Keeps procedural logic reusable
* Offers getter/setter access to position

---

## 4.2 Constructor

```ts
new Player(x?, y?, speed?, size?)
```

Creates internal state using `createPlayer`.

### Example:

```ts
const player = new Player(100, 200);
```

---

## 4.3 Methods

### update

```ts
update(dt, input): boolean
```

Delegates to:

```ts
updatePlayer(this.state, dt, input);
```

Returns whether movement occurred.

---

### render

```ts
render(ctx, alpha)
```

Delegates to:

```ts
renderPlayer(this.state, ctx, alpha);
```

---

## 4.4 Position Accessors

### Getter

```ts
player.x;
player.y;
```

Returns current position.

### Setter

```ts
player.x = 300;
player.y = 400;
```

Directly modifies internal state.

---

# 5. Game Integration

File: `src/game.ts`

The player is integrated into the game loop via `GameState`.

---

## 5.1 GameState Structure

```ts
export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
};
```

The player depends on:

* Input → movement control
* Renderer → drawing
* Audio → feedback

---

## 5.2 Creating the Game

```ts
createGame(renderer, input, audio)
```

Initializes:

* Renderer
* Input
* Audio
* Player (default position)

```ts
player: new Player()
```

---

## 5.3 Update Loop

```ts
updateGame(state, dt)
```

### Flow:

1. Update player:

   ```ts
   const moved = state.player.update(dt, state.input);
   ```

2. If movement occurred:

   ```ts
   state.audio.play("move");
   ```

### Behavior:

* Audio only plays when player moves
* Prevents continuous sound spam when idle

---

## 5.4 Render Loop

```ts
renderGame(state, alpha)
```

### Flow:

1. Clear screen:

   ```ts
   state.renderer.clear();
   ```

2. Render player:

   ```ts
   state.player.render(state.renderer.ctx, alpha);
   ```

---

## 5.5 Music Initialization

```ts
startGameMusic(state)
```

Plays background music:

```ts
state.audio.playMusic("bg", 0.5);
```

* `"bg"` → background track
* `0.5` → volume level

---

# 6. Summary

### Procedural Layer

* `createPlayer` → creates state
* `updatePlayer` → handles movement logic
* `renderPlayer` → draws interpolated sprite

### OOP Layer

* `Player` class wraps state
* Delegates logic to procedural functions
* Adds clean interface for game systems

### Game Layer

* Handles update/render loop
* Triggers audio on movement
* Connects input, rendering, and player logic

---

If you want, I can also extend this documentation with:

* collision system design
* camera follow logic
* physics upgrade path
* multiplayer sync model