## Game System (Core Loop)

### Purpose / Design Intent

The game system is responsible for orchestrating the entire runtime of the application. It ties together rendering, input handling, audio playback, and player logic into a single cohesive update/render loop. It is designed as a thin coordination layer over engine-provided abstractions (`Renderer`, `Input`, `Audio`) and game-specific entities (`Player`).

---

### Description

The system is split into two architectural layers:

* **Functional core (`game.ts`)**

  * Defines `GameState`
  * Provides `createGame`, `updateGame`, and `renderGame`
  * Encapsulates pure game logic and state transitions

* **Object-oriented wrapper (`oop/game.ts`)**

  * Implements `Game` class
  * Adapts functional core to engine interfaces (`IUpdatable`, `IRenderable`)
  * Serves as the bridge to the engine `GameLoop`

* **Application bootstrap (`main.ts`)**

  * Initializes engine subsystems
  * Loads audio assets
  * Manages DOM interaction (start overlay)
  * Starts the main game loop

---

### Game Lifecycle

#### Appearance / Spawn

* `main.ts` creates:

  * `Renderer` (canvas binding)
  * `Input`
  * `Audio`
* Audio assets are loaded asynchronously (`move`, `bg`)
* A `Game` instance is constructed, internally calling `createGame(...)`
* The game is initially hidden behind a start overlay

#### Active State

* The `GameLoop` continuously calls:

  * `update(dt)` → game logic update
  * `render(alpha)` → frame rendering
* Player state is updated every tick via `updateGame`

#### Player Interaction

* Player movement is driven by `Input`
* Movement is processed inside `Player.update(dt, input)`
* When movement occurs:

  * A `"move"` sound is triggered via `Audio.play("move")`
* Rendering displays the player on the canvas each frame

#### End State (Despawn / Reset / Destroy)

* No explicit teardown logic is defined in this code
* Lifecycle termination would depend on:

  * Stopping the `GameLoop`
  * Disposing renderer/audio resources externally

---

### Player Interaction

The player experiences the system indirectly through:

* **Keyboard or input device controls**

  * Processed by `Input`
  * Interpreted inside `Player.update`

* **Immediate audio feedback**

  * Movement triggers a short sound effect (`move.wav`)

* **Visual feedback**

  * Player is rendered every frame via `Player.render(ctx, alpha)`

* **Start sequence gating**

  * Gameplay and background music begin only after user interaction (click on overlay)

---

### Rules / Mechanics

* Game state is updated using a fixed timestep (`dt`)
* Rendering uses interpolation (`alpha`) for smooth visuals
* Player movement is the only state-driven interaction shown
* Audio triggers are event-based:

  * Only plays `"move"` when `Player.update` returns `true`
* Rendering pipeline:

  1. Clear renderer
  2. Render player entity

---

### Feedback

* **Audio**

  * `"move"`: played on successful player movement
  * `"bg"`: background music triggered after user gesture

* **Visual**

  * Canvas cleared each frame
  * Player rendered via engine renderer context

* **UI**

  * Start overlay hides game until user clicks
  * Canvas visibility toggled on start

---

### Variants (if any)

* **Functional architecture (`game.ts`)**

  * Pure state-driven functions

* **Object-oriented wrapper (`oop/game.ts`)**

  * Engine-compatible class abstraction

This dual approach allows flexibility between functional logic and engine integration.

---

### Edge Cases / Exceptions

* Audio may fail to play if assets are not fully loaded
* Background music requires user interaction due to browser autoplay restrictions
* `renderer.ctx` assumes valid canvas context is always available
* `Player.update` return value is critical; if undefined, movement feedback breaks
* No explicit error handling for missing DOM elements (`overlay`, `canvas`)

---

### Related Elements

* `Renderer` (drawing system)
* `Input` (user control handling)
* `Audio` (sound system)
* `GameLoop` (frame scheduling)
* `Player` (core gameplay entity)
* `GameState` (shared runtime state container)

---

### Example (in-game scenario)

1. Game loads and shows start overlay
2. User clicks overlay:

   * Overlay hides
   * Canvas becomes visible
   * Background music starts
3. GameLoop begins execution
4. Player presses movement key:

   * `Player.update` returns `true`
   * Player position updates
   * `"move"` sound plays
   * Player is rendered at new position
5. Loop continues, updating and rendering every frame