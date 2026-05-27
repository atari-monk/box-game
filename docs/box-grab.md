[pl](pl/box-grab.md)

# Box Grab System

The box grab system allows the player to pick up, carry, and release moving conveyor boxes using keyboard input. It extends the base box behavior with player interaction state and integrates directly into the demo gameplay loop.

---

# Overview

The feature is implemented in `src/box.ts` through:

* additional grab-related box state
* player proximity detection
* attachment logic
* release handling
* movement override while carried

The demo integration lives in:

* `src/demo/box-grab.ts`

where the player, conveyor belt, and box factory are connected together.

---

# Box State

`BoxState` extends `RectState` with gameplay-specific properties.

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

| Property          | Description                                        |
| ----------------- | -------------------------------------------------- |
| `speed`           | Horizontal conveyor movement speed                 |
| `grabbedByPlayer` | Indicates whether the player is carrying the box   |
| `inGrid`          | Prevents grabbing boxes already placed into a grid |
| `color`           | Box color variant                                  |
| `offsetX`         | Relative X offset from player while carried        |
| `offsetY`         | Relative Y offset from player while carried        |

The inherited `RectState` provides:

```ts
x
y
width
height
color
```

from `src/rect.ts`.

---

# Creating Boxes

Boxes are created through `createBox()`.

```ts
createBox(
    x,
    y,
    color,
    size = 20,
    speed = 80
)
```

Example:

```ts
const box = createBox(100, 50, "red");
```

## Internal Initialization

Each box:

* uses `createRect()` for base rectangle data
* receives a semi-transparent color
* starts ungrabbed
* starts outside the grid

```ts
grabbedByPlayer: false,
inGrid: false
```

---

# Box Movement

Movement is handled by `updateBox()`.

```ts
updateBox(
    box,
    dt,
    startX,
    endX,
    player
)
```

The function supports two movement modes:

---

## Conveyor Movement

When the box is not grabbed:

```ts
box.x += box.speed * dt;
```

If the box exits the conveyor boundary:

```ts
if (box.x > endX) {
    box.x = startX;
}
```

This creates a looping conveyor effect.

---

## Player-Carried Movement

When grabbed:

```ts
if (box.grabbedByPlayer && player) {
    box.x = player.x + (box.offsetX ?? 0);
    box.y = player.y + (box.offsetY ?? 0);
    return;
}
```

The box stops using conveyor motion and instead follows the player position.

The stored offsets preserve the original grab position relative to the player.

---

# Grab Logic

Player interaction is implemented through:

```ts
handleBoxGrab(
    boxes,
    player,
    input
)
```

The interaction uses the `E` key:

```ts
if (!input.isPressed("e")) return;
```

---

# Grabbing a Box

The system loops through all available boxes.

Boxes already placed into a grid are ignored:

```ts
if (box.inGrid) continue;
```

Distance is measured between box center and player center.

```ts
const dx = playerCenterX - boxCenterX;
const dy = playerCenterY - boxCenterY;
```

A grab occurs when:

```ts
Math.hypot(dx, dy) < grabRange
```

with:

```ts
const grabRange = 80;
```

---

## Grab State Changes

When grabbed:

```ts
box.grabbedByPlayer = true;
```

The relative carry offset is stored:

```ts
box.offsetX = box.x - player.x;
box.offsetY = box.y - player.y;
```

Conveyor motion is disabled:

```ts
box.speed = 0;
```

---

# Releasing a Box

If the player presses `E` while already carrying a box:

```ts
if (box.grabbedByPlayer) {
    box.grabbedByPlayer = false;
    break;
}
```

The box is detached from the player.

The current implementation does not restore conveyor speed automatically after release. Released boxes remain stationary unless another system updates their speed later.

---

# Input Handling

The feature relies on the engine `Input` system.

## Required Input Methods

```ts
input.isPressed("e")
```

Used for one-time grab/release interaction.

```ts
input.clearPressed()
```

Clears the pressed state after processing interaction input.

This prevents repeated grabs during the same frame.

---

# Rendering

Rendering uses the shared rectangle renderer:

```ts
renderBox(box, ctx)
```

which internally calls:

```ts
renderRect(box, ctx);
```

from `src/rect.ts`.

The box grab system itself does not alter rendering behavior.

---

# Demo Integration

The demo in `src/demo/box-grab.ts` combines:

* player movement
* conveyor movement
* box spawning
* collision handling
* box grabbing

into a complete gameplay example.

---

# Game Setup

The demo creates:

## Conveyor Belt

```ts
createConveyorBelt({
    centerX: 960,
    centerY: 60,
    length: 700,
    width: 40,
    gateWidth: 100,
    gateHeight: 100
});
```

---

## Box Factory

```ts
createBoxFactory(conveyor, {
    maxBoxesOnConveyor: 4,
    spawnInterval: 1.5,
    boxSize: 20,
    boxSpeed: 80,
    spawnCounts: {
        red: 4,
        green: 4,
        yellow: 4,
        purple: 4
    }
});
```

The factory continuously spawns conveyor boxes that can later be grabbed.

---

## Player

```ts
new Player(960 - 25, 350, 200, 50)
```

The player uses the movement system from `src/player.ts`.

Movement is controlled with arrow keys.

---

# Update Loop Integration

The demo update loop coordinates all systems.

## Player Update

```ts
const moved = state.player.update(dt, state.input);
```

Movement audio is played when movement occurs.

---

## Conveyor + Box Updates

```ts
updateBoxFactory(state.boxFactory, dt, playerState);
updateConveyorBelt(state.conveyor, dt);
```

The factory updates box movement and spawn timing.

---

## Grab Interaction

```ts
handleBoxGrab(
    state.boxFactory.boxes,
    playerState,
    state.input
);
```

This connects player interaction directly to active conveyor boxes.

---

## Collision Resolution

```ts
resolvePlayerRectCollisions(
    playerState,
    state.colliders
);
```

Player movement is constrained by conveyor collision geometry.

This ensures grabbed boxes visually move with a properly constrained player.

---

# Render Flow

The render order is:

```ts
renderConveyorBelt(...)
renderBoxFactory(...)
player.render(...)
```

This keeps:

1. conveyor in the background
2. boxes above the conveyor
3. player rendered last

for correct visual layering.

---

# Dependency Relationships

## `player.ts`

Provides:

* player movement
* interpolated rendering
* player position/state used for grab calculations

The grab system depends on:

```ts
player.x
player.y
player.size
```

for distance checks and carry offsets.

---

## `rect.ts`

Provides the shared rectangle abstraction:

```ts
createRect()
renderRect()
```

Boxes inherit all rectangle rendering and geometry behavior through `RectState`.

---

# Gameplay Flow

The complete interaction flow is:

1. Conveyor spawns moving boxes
2. Player approaches a box
3. Player presses `E`
4. Nearby box attaches to player
5. Conveyor movement stops for that box
6. Box follows player movement
7. Player presses `E` again
8. Box is released at current position

This creates a lightweight object interaction system suitable for conveyor, sorting, or factory-style gameplay mechanics.