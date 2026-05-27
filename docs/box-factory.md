[pl](pl/box-factory.md)

# Box Factory

The box factory is responsible for spawning, updating, tracking, and rendering moving conveyor boxes in the game world.

It acts as a lightweight gameplay system that sits between:

* the conveyor belt
* player interaction
* individual box behavior

The factory does **not** implement box movement itself. Instead, it coordinates multiple `BoxState` instances and delegates per-box logic to the box module.

---

# Responsibilities

The factory handles:

* lane generation
* timed spawning
* spawn limits
* weighted/random color distribution
* active box tracking
* conveyor occupancy
* lifecycle cleanup
* rendering delegation

---

# Core Types

## `BoxFactoryConfig`

Configuration for spawning and conveyor behavior.

```ts
export type BoxFactoryConfig = {
    maxBoxesOnConveyor: number;
    spawnInterval: number;
    boxSize: number;
    boxSpeed: number;
    spawnCounts: {
        red: number;
        green: number;
        yellow: number;
        purple: number;
    };
};
```

## Properties

| Property             | Description                             |
| -------------------- | --------------------------------------- |
| `maxBoxesOnConveyor` | Maximum number of active conveyor boxes |
| `spawnInterval`      | Seconds between spawn attempts          |
| `boxSize`            | Width and height of spawned boxes       |
| `boxSpeed`           | Horizontal conveyor speed               |
| `spawnCounts`        | Total amount of each color available    |

---

# `BoxFactoryState`

Runtime state for the entire factory.

```ts
export type BoxFactoryState = {
    boxes: BoxState[];
    conveyorStartX: number;
    conveyorEndX: number;
    conveyorCenterY: number;
    conveyorWidth: number;
    lanes: number[];
    spawnTimer: number;
    config: BoxFactoryConfig;
    spawnCountsLeft: {
        red: number;
        green: number;
        yellow: number;
        purple: number;
    };
};
```

---

# Factory Creation

## `createBoxFactory`

Creates the factory and initializes conveyor lanes.

```ts
createBoxFactory(conveyor, config)
```

## Parameters

### `conveyor`

```ts
{
    startX: number;
    endX: number;
    config: ConveyorBeltConfig;
}
```

The factory extracts:

* conveyor bounds
* conveyor width
* center position
* lane layout

### `config`

Factory spawning configuration.

---

# Lane Generation

The factory dynamically creates movement lanes using conveyor width.

```ts
const laneCount = Math.max(1, Math.floor(config.width / 20));
```

Spacing is evenly distributed vertically across the conveyor.

Example:

```txt
| lane 1 |
| lane 2 |
| lane 3 |
```

Generated lanes are stored as Y coordinates:

```ts
lanes: number[]
```

This allows boxes to spawn on randomized rows while remaining visually aligned to the conveyor.

---

# Update Cycle

## `updateBoxFactory`

```ts
updateBoxFactory(factory, dt, player?)
```

This is the main runtime loop.

---

# Step 1 — Update Existing Boxes

```ts
updateBox(box, dt, ...)
```

Each box updates independently through the box module.

The factory provides:

* delta time
* conveyor bounds
* optional player state

The box system then handles:

* conveyor movement
* player carrying
* wrapping behavior

---

# Step 2 — Cleanup

```ts
factory.boxes = factory.boxes.filter(
    box => box.x < factory.conveyorEndX
);
```

Boxes beyond the conveyor end are removed from the active list.

This prevents unused entities from accumulating.

---

# Step 3 — Spawn Timer

```ts
factory.spawnTimer += dt;
```

The timer accumulates elapsed time until:

```ts
spawnTimer >= spawnInterval
```

---

# Step 4 — Conveyor Capacity Check

The factory limits active conveyor occupancy using:

```ts
countBoxesOnConveyor(factory)
```

Boxes currently:

* grabbed by the player
* placed in the grid

are excluded from conveyor counts.

```ts
if (!box.grabbedByPlayer && !box.inGrid)
```

This allows gameplay interactions without blocking future spawns.

---

# Step 5 — Color Selection

The factory uses weighted random spawning based on remaining counts.

Example:

```ts
spawnCountsLeft = {
    red: 4,
    green: 2,
    yellow: 1,
    purple: 0
}
```

Probability automatically adapts as colors are depleted.

This guarantees:

* exact total spawn counts
* randomized order
* no over-spawning

---

# Step 6 — Box Creation

After selecting a lane and color:

```ts
const box = createBox(
    factory.conveyorStartX,
    y,
    color,
    factory.config.boxSize,
    factory.config.boxSpeed
);
```

The box is then pushed into:

```ts
factory.boxes
```

---

# Rendering

## `renderBoxFactory`

```ts
renderBoxFactory(factory, ctx)
```

Rendering is intentionally simple:

```ts
for (const box of factory.boxes) {
    renderBox(box, ctx);
}
```

The factory delegates all visual rendering to the box module.

This keeps responsibilities separated:

| System  | Responsibility     |
| ------- | ------------------ |
| Factory | orchestration      |
| Box     | visuals + movement |

---

# Relationship With `box.ts`

The factory depends heavily on the box module.

## Factory Uses

### `createBox`

Creates initialized box entities.

### `updateBox`

Handles:

* conveyor movement
* player attachment
* positional updates

### `renderBox`

Draws the box rectangle.

---

# Box State Integration

Each spawned box contains:

```ts
type BoxState = RectState & {
    speed: number;
    grabbedByPlayer: boolean;
    inGrid: boolean;
    color: BoxColor;
}
```

The factory relies on:

| Property          | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `grabbedByPlayer` | excludes carried boxes from conveyor counts |
| `inGrid`          | excludes placed boxes from conveyor counts  |
| `speed`           | movement control                            |
| `color`           | gameplay categorization                     |

---

# Relationship With Conveyor Belt

The factory is conveyor-aware but not conveyor-controlled.

It uses conveyor data to determine:

* spawn start position
* despawn bounds
* lane placement
* conveyor dimensions

```ts
conveyor.startX
conveyor.endX
conveyor.config.width
conveyor.config.centerY
```

The conveyor itself remains responsible for:

* visuals
* collision geometry
* animation
* gameplay toggles

---

# Relationship With Player

The player is optional during updates:

```ts
updateBoxFactory(factory, dt, player?)
```

This allows boxes to:

* follow player movement
* remain attached while grabbed

The actual carrying behavior is implemented inside `updateBox`.

The factory simply forwards player state to active boxes.

---

# Demo Integration

## `BoxFactoryDemo`

The demo integrates:

* player movement
* conveyor belt
* collision
* box factory spawning

into a playable test scene.

---

# Scene Setup

## Conveyor Creation

```ts
const conveyor = createConveyorBelt({
    centerX: 960,
    centerY: 60,
    length: 700,
    width: 40,
    gateWidth: 100,
    gateHeight: 100
});
```

This conveyor becomes the spatial foundation for the box factory.

---

# Factory Initialization

```ts
const boxFactory = createBoxFactory(conveyor, {
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

## Result

The demo produces:

* four box colors
* randomized spawning
* limited conveyor occupancy
* evenly spaced conveyor lanes

---

# Runtime Update Flow

Inside `updateGame`:

```ts
updateBoxFactory(state.boxFactory, dt, state.player.state);
```

The box factory updates before conveyor collision resolution.

This ensures:

1. boxes move
2. player interactions update
3. collisions resolve afterward

---

# Render Flow

```ts
renderConveyorBelt(state.conveyor, ctx);
renderBoxFactory(state.boxFactory, ctx);
state.player.render(ctx, alpha);
```

Rendering order matters:

| Layer    | Purpose                 |
| -------- | ----------------------- |
| Conveyor | background system       |
| Boxes    | moving gameplay objects |
| Player   | foreground actor        |

---

# Gameplay Characteristics

The demo currently showcases:

* continuous conveyor spawning
* lane-based box movement
* randomized color generation
* player/box interaction support
* conveyor occupancy management

It effectively serves as:

* a gameplay sandbox
* a spawning system testbed
* a conveyor interaction prototype

---

# Design Notes

The factory is intentionally lightweight and data-oriented.

Benefits include:

* predictable spawning
* low coupling
* modular rendering
* reusable conveyor integration
* easy gameplay extension

Future systems can extend the factory with:

* scoring
* box matching
* delivery zones
* assembly mechanics
* pickup/drop interactions
* object pooling
* spawn scripting
* difficulty scaling