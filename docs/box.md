[pl](pl/box.md)

Below is a **synchronized and corrected version of the Box documentation**, aligned with the current codebase, followed by an explanation of how the demo integrates boxes into the game loop and how dependencies interact.

---

# 📦 Box Module Documentation (Updated)

The `box.ts` module defines a **moving, renderable rectangle entity** with optional player interaction and collision compatibility.

It builds on top of `rect.ts` and extends it with:

* Horizontal autonomous movement
* Player-grab support (attach-to-player behavior)
* Collision compatibility via `RectState`
* Extra gameplay state flags

---

# 🧠 Box State

```ts
export type BoxState = RectState & {
    speed: number;
    grabbedByPlayer: boolean;
    inGrid: boolean;
    color: BoxColor;
    offsetX?: number;
    offsetY?: number;
};
```

## Properties

| Property              | Type     | Description                    |
| --------------------- | -------- | ------------------------------ |
| `x, y`                | number   | Position (from `RectState`)    |
| `width, height`       | number   | Size (from `RectState`)        |
| `color`               | BoxColor | Logical color identifier       |
| `speed`               | number   | Horizontal movement speed      |
| `grabbedByPlayer`     | boolean  | If true, box follows player    |
| `inGrid`              | boolean  | Reserved gameplay state flag   |
| `offsetX` / `offsetY` | number   | Offset when attached to player |

---

# 🧱 createBox

```ts
createBox(
    x: number,
    y: number,
    color: BoxColor,
    size = 20,
    speed = 80
): BoxState
```

## Behavior

Creates a rectangle with:

* Semi-transparent color based on `color`
* Default square size
* Horizontal movement speed
* Initial inactive interaction state

## Color mapping

```ts
red    -> rgba(255,0,0,.5)
green  -> rgba(0,255,0,.5)
yellow -> rgba(255,255,0,.5)
purple -> rgba(128,0,128,.5)
```

---

# 🔄 updateBox (Core Behavior)

```ts
updateBox(
    box: BoxState,
    dt: number,
    startX: number,
    endX: number,
    player?: PlayerState
)
```

## 1. Player Grab Mode

If the box is grabbed:

```ts
if (box.grabbedByPlayer && player) {
    box.x = player.x + (box.offsetX ?? 0);
    box.y = player.y + (box.offsetY ?? 0);
    return;
}
```

### Effect

* Box becomes **attached to player**
* Movement is fully controlled by player position
* Offset preserves relative grab position

---

## 2. Idle / Disabled Movement

```ts
if (box.speed === 0) return;
```

* Box becomes static if speed is 0
* Still valid for collisions

---

## 3. Automatic Horizontal Movement

```ts
box.x += box.speed * dt;
```

Boxes move continuously to the right using delta time.

---

## 4. Screen Wrapping

```ts
if (box.x > endX) {
    box.x = startX;
}
```

This creates an **infinite looping conveyor effect**.

---

# 🎨 renderBox

```ts
renderBox(
    box: BoxState,
    ctx: CanvasRenderingContext2D
)
```

Delegates rendering to:

```ts
renderRect(box, ctx);
```

No custom rendering logic is added beyond color + rectangle drawing.

---

# 🎮 Demo Integration (BoxDemo)

The `BoxDemo` class demonstrates how boxes function inside a full game loop using the engine.

```ts
export class BoxDemo implements IGame {
```

It integrates:

* Renderer
* Input system
* Audio system
* Player system
* Collision system
* Box system

---

# 🧩 Game State

```ts
type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
    boxes: BoxState[];
    colliders: RectState[];
};
```

## Key relationships

### boxes

```ts
boxes: BoxState[]
```

Active moving gameplay objects.

---

### colliders

```ts
colliders: RectState[]
```

Collision system input.

Important detail:

> Boxes are directly inserted into colliders because `BoxState extends RectState`

```ts
colliders: [...boxes]
```

This allows **zero conversion cost** between gameplay and physics.

---

# 🏗️ Game Initialization

```ts
const boxes = [
    createBox(650, 200, "red"),
    createBox(650, 230, "green"),
    createBox(650, 260, "yellow"),
    createBox(650, 290, "purple")
];
```

### Layout behavior

* Vertical stack
* Same X coordinate (lane)
* Different Y positions
* Independent movement states

---

# 🔁 Update Loop

## 1. Player Update

```ts
const moved = state.player.update(dt, state.input);
```

Returns whether movement occurred.

---

## 2. Audio Feedback

```ts
if (moved) {
    state.audio.play("move");
}
```

Simple feedback loop tied to input activity.

---

## 3. Box Simulation

```ts
for (const box of state.boxes) {
    updateBox(box, dt, 650, 650 + 300);
}
```

### Movement region:

* Start: `650`
* End: `950`

Each box:

* Moves right
* Wraps back to start
* Remains active in collision system

---

## 4. Collision Resolution

```ts
resolvePlayerRectCollisions(
    state.player.state,
    state.colliders
);
```

### What happens here:

* Player rectangle is tested against all colliders
* Colliders include boxes
* Collision is agnostic to entity type due to shared `RectState`

---

# 🖼️ Render Loop

## 1. Clear Screen

```ts
state.renderer.clear();
```

---

## 2. Render Boxes

```ts
for (const box of state.boxes) {
    renderBox(box, state.renderer.ctx);
}
```

* Draws all moving obstacles
* Order does not affect gameplay logic

---

## 3. Render Player

```ts
state.player.render(ctx, alpha);
```

* Rendered after boxes
* Uses interpolation (`alpha`) for smooth movement

---

# 🔗 Dependency Relationships

## rect.ts (Base Layer)

Provides:

* `RectState`
* `createRect`
* `renderRect`

Used by:

* Box system
* Collision system
* Player collision integration

---

## box.ts (Gameplay Entity Layer)

Builds on:

* `RectState` (geometry contract)
* `renderRect` (rendering reuse)

Extends with:

* Movement system
* Player interaction state
* Game-specific flags

---

## player.ts (Actor Layer)

Provides:

* Movement + input handling
* Interpolated rendering
* Position history (`prevX/prevY`)

Used by:

* Box grabbing logic
* Collision resolution system

---

## collision system (external)

```ts
resolvePlayerRectCollisions(player, colliders)
```

Consumes:

* Player rectangle
* Box rectangles (via `colliders`)

---

# 🧩 Design Summary

This system demonstrates a clean layered architecture:

### 1. Geometry Layer

`RectState`

→ pure data shape

---

### 2. Entity Layer

`BoxState`, `PlayerState`

→ adds behavior/state

---

### 3. Simulation Layer

`updateBox`, `updatePlayer`

→ deterministic update logic

---

### 4. Engine Layer

`BoxDemo`

→ orchestrates:

* input
* audio
* update loop
* rendering
* collisions

---

# 📌 Key Improvements in Current Code (vs Docs)

* ✔ Boxes can now be **grabbed by player**
* ✔ Boxes support **offset-based attachment**
* ✔ Boxes include **extra state flags (`inGrid`)**
* ✔ Player can influence box position indirectly
* ✔ Collision system is fully type-polymorphic via `RectState`
* ✔ Movement can be disabled via `speed = 0`

---

# 🧾 Final Summary

The current box system is no longer just a moving obstacle system.

It now supports:

* Autonomous movement
* Player attachment (grab mechanics)
* Collision participation
* Shared rendering model
* Extensible gameplay flags

The `BoxDemo` ties everything together into a minimal but complete gameplay loop where:

> Input → Player → Boxes → Collisions → Rendering → Audio feedback

If you want, I can next:

* refactor this into ECS-style components
* or suggest improvements to collision + grabbing logic
* or diagram the entire update pipeline visually