[pl](pl/rect-collision.md)

# Rect Player Collision

The collision system resolves overlap between the player and axis-aligned rectangles (`RectState`) by separating movement into two independent passes:

1. Horizontal collision resolution (`x`)
2. Vertical collision resolution (`y`)

This approach prevents the player from clipping through walls while still allowing smooth sliding along surfaces.

---

## Collision Detection

The `intersects()` helper performs an AABB (Axis-Aligned Bounding Box) overlap test.

```ts
function intersects(
    px: number,
    py: number,
    size: number,
    rect: RectState
) {
    return (
        px < rect.x + rect.width &&
        px + size > rect.x &&
        py < rect.y + rect.height &&
        py + size > rect.y
    );
}
```

### Parameters

| Parameter  | Description        |
| ---------- | ------------------ |
| `px`, `py` | Player position    |
| `size`     | Player square size |
| `rect`     | Rectangle collider |

### Returns

`true` when the player overlaps the rectangle.

---

# Collision Resolution

```ts
resolvePlayerRectCollisions(player, rects)
```

The resolver uses the player's previous frame position to determine movement direction and resolve collisions safely.

---

## Movement Delta

```ts
const dx = player.x - player.prevX;
const dy = player.y - player.prevY;
```

The movement delta tells the system:

* how far the player moved
* which direction the player moved

---

## Reset to Previous Position

```ts
player.x = player.prevX;
player.y = player.prevY;
```

The player is temporarily restored to the last non-colliding position before collision resolution begins.

This avoids deep penetration issues.

---

# Horizontal Collision Pass

```ts
player.x += dx;
```

The horizontal movement is applied first.

Each rectangle is then checked:

```ts
for (const rect of rects) {
    if (!intersects(player.x, player.y, size, rect)) continue;

    if (dx > 0) {
        player.x = rect.x - size;
    } else if (dx < 0) {
        player.x = rect.x + rect.width;
    }
}
```

---

## Right Movement

```ts
player.x = rect.x - size;
```

If moving right (`dx > 0`):

* the player's right edge is snapped to the rectangle's left edge

---

## Left Movement

```ts
player.x = rect.x + rect.width;
```

If moving left (`dx < 0`):

* the player's left edge is snapped to the rectangle's right edge

---

# Vertical Collision Pass

After horizontal resolution:

```ts
player.y += dy;
```

The same process is repeated vertically.

```ts
for (const rect of rects) {
    if (!intersects(player.x, player.y, size, rect)) continue;

    if (dy > 0) {
        player.y = rect.y - size;
    } else if (dy < 0) {
        player.y = rect.y + rect.height;
    }
}
```

---

## Downward Movement

```ts
player.y = rect.y - size;
```

If moving downward:

* the player lands on top of the rectangle

---

## Upward Movement

```ts
player.y = rect.y + rect.height;
```

If moving upward:

* the player is pushed below the rectangle

---

# Why Separate Axes?

Resolving one axis at a time provides stable collision behavior.

Benefits:

* smooth wall sliding
* prevents corner sticking
* simpler logic
* predictable resolution order

Without axis separation, diagonal movement often produces jitter or incorrect pushes.

---

# Game Integration

Collision resolution is integrated inside `updateGame()` after player movement.

```ts
export function updateGame(
    state: GameState,
    dt: number
) {
    const moved = state.player.update(dt, state.input);

    if (moved) {
        state.audio.play("move");
    }

    resolvePlayerRectCollisions(
        state.player.state,
        [state.rect_c.state, state.rect_d.state]
    );
}
```

---

## Update Flow

The game update pipeline works like this:

```text
Input
  ↓
Player Movement
  ↓
Collision Resolution
  ↓
Rendering
```

---

## Current Collidable Rectangles

Only these rectangles currently block the player:

```ts
[state.rect_c.state, state.rect_d.state]
```

These are rendered as solid collision objects.

---

## Non-Collidable Rectangles

`rect_a` and `rect_b` are rendered visually but are not included in collision resolution.

```ts
state.rect_a.render(ctx);
state.rect_b.render(ctx);
```

This allows decorative or background geometry without physical collision.

---

# Example Collision Scenario

Player moving right into a wall:

```text
Before movement:
[P]

After movement:
    [P][WALL]

Collision resolution:
   [P][WALL]
```

The player is snapped flush against the wall edge and prevented from entering the rectangle.

---

# Summary

The collision system:

* uses AABB overlap checks
* resolves movement one axis at a time
* restores the previous safe position before solving
* supports smooth sliding against walls
* integrates cleanly into the game update loop

This design is lightweight, deterministic, and ideal for 2D tile-based or rectangle-based movement systems.