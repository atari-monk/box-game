[pl](pl/box.md)

# Box Module Documentation

The `box.ts` module builds on top of the rectangle utilities from `rect.ts` and adds simple movement behavior for game entities.

## Purpose

A `Box` is:

* A renderable rectangle
* With movement speed
* That automatically moves horizontally
* And can participate in collisions

It is primarily used in the demo as a moving obstacle.

---

# Box State

```ts
export type BoxState = RectState & {
    speed: number;
};
```

`BoxState` extends `RectState` and adds:

| Property | Type     | Description               |
| -------- | -------- | ------------------------- |
| `x`      | `number` | Horizontal position       |
| `y`      | `number` | Vertical position         |
| `width`  | `number` | Box width                 |
| `height` | `number` | Box height                |
| `color`  | `string` | Fill color                |
| `speed`  | `number` | Horizontal movement speed |

Because it extends `RectState`, a box can be reused anywhere rectangle collision or rendering is needed.

---

# createBox

Creates a moving square box.

```ts
createBox(
    x: number,
    y: number,
    size = 20,
    speed = 80
): BoxState
```

## Parameters

| Parameter | Description                    |
| --------- | ------------------------------ |
| `x`       | Initial horizontal position    |
| `y`       | Initial vertical position      |
| `size`    | Width and height of the square |
| `speed`   | Horizontal movement speed      |

## Example

```ts
const box = createBox(650, 200);
```

## Default Appearance

Boxes are created with:

```ts
"rgba(255,0,0,.5)"
```

This produces a semi-transparent red square.

---

# updateBox

Updates horizontal movement.

```ts
updateBox(
    box: BoxState,
    dt: number,
    startX: number,
    endX: number
)
```

## Behavior

Each frame:

```ts
box.x += box.speed * dt;
```

The box moves to the right using delta time.

When the box moves beyond `endX`:

```ts
if (box.x > endX) {
    box.x = startX;
}
```

it wraps back to `startX`.

This creates a continuous looping movement.

## Example

```ts
updateBox(box, dt, 650, 950);
```

---

# renderBox

Renders the box to the canvas.

```ts
renderBox(
    box: BoxState,
    ctx: CanvasRenderingContext2D
)
```

Internally it delegates rendering to `renderRect`.

## Example

```ts
renderBox(box, ctx);
```

---

# Demo/Game Integration

The `BoxDemo` class demonstrates how boxes integrate with the engine, player movement, rendering, audio, and collision systems.

---

# Game State Structure

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

## Important Relationships

### `boxes`

Stores the active moving boxes:

```ts
boxes: BoxState[];
```

### `colliders`

Stores collision rectangles used by the collision system:

```ts
colliders: RectState[];
```

Boxes are inserted into the collider list:

```ts
colliders: [
    ...boxes
]
```

Because `BoxState` extends `RectState`, boxes can be treated as generic collision rectangles.

---

# Game Creation

Boxes are created during initialization:

```ts
const boxes = [
    createBox(650, 200),
    createBox(650, 230),
    createBox(650, 260),
    createBox(650, 290)
];
```

This creates a vertical row of moving obstacles.

The player is also initialized:

```ts
player: new Player(960 - 25, 350, 200, 50)
```

---

# Update Flow

Each frame:

## 1. Player Updates

```ts
const moved = state.player.update(dt, state.input);
```

The player processes input and movement.

---

## 2. Audio Trigger

```ts
if (moved) {
    state.audio.play("move");
}
```

Movement sound plays only when the player moves.

---

## 3. Boxes Update

```ts
for (const box of state.boxes) {
    updateBox(box, dt, 650, 650 + 300);
}
```

Every box moves horizontally and loops back when exceeding the boundary.

Movement range:

* Start: `650`
* End: `950`

---

## 4. Collision Resolution

```ts
resolvePlayerRectCollisions(
    state.player.state,
    state.colliders
);
```

The player's rectangle is checked against all collider rectangles.

Since boxes are included in `colliders`, the player collides with moving boxes automatically.

---

# Render Flow

Rendering occurs in this order:

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

All moving obstacles are drawn.

---

## 3. Render Player

```ts
state.player.render(ctx, alpha);
```

The player is rendered after the boxes.

---

# Design Notes

This architecture demonstrates several reusable patterns:

## Composition Over Duplication

`BoxState` extends `RectState` instead of redefining rectangle properties.

---

## Shared Collision Types

Any object compatible with `RectState` can participate in collision detection.

---

## Decoupled Rendering

`renderBox` delegates rendering to `renderRect`.

This keeps rendering logic centralized.

---

## Stateless Update Functions

`updateBox` only mutates the provided state object and depends entirely on parameters:

```ts
updateBox(box, dt, startX, endX)
```

This makes behavior predictable and reusable.

---

# Summary

The box system provides:

* Reusable rectangle-based entities
* Automatic horizontal movement
* Looping obstacle behavior
* Shared collision compatibility
* Simple rendering integration

The demo shows how boxes can be integrated into:

* Game state management
* Update loops
* Rendering pipelines
* Collision systems
* Audio-triggered gameplay logic