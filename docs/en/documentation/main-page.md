## Box Game (Main Page Component)

### Purpose / Design Intent

The main page acts as the entry point of the game application. It is responsible for bootstrapping the engine, initializing core systems (rendering, input, audio, and game loop), and gating game start behind a user interaction to comply with browser audio policies.

It combines HTML structure, global styles, and TypeScript initialization into a single cohesive runtime environment.

---

### Description

This component consists of three tightly connected parts:

* **HTML (`index.html`)**: Defines the canvas, start overlay, and script entry point.
* **Styles (`style.css`)**: Controls fullscreen layout, hidden canvas state, and overlay presentation.
* **Main logic (`main.ts`)**: Initializes engine systems and starts the game loop.

Together, they form the full application bootstrap.

Key runtime flow:

1. Page loads → overlay is visible, canvas is hidden
2. Engine systems are created (Renderer, Input, Audio, Game)
3. Audio assets are preloaded asynchronously
4. Game loop starts immediately (logic runs even before visibility)
5. User clicks overlay
6. Canvas is revealed and background music starts
7. Game becomes fully interactive

---

### Game Lifecycle

* **Appearance / Spawn**

  * HTML loads immediately
  * Overlay (`#start-overlay`) is displayed full-screen
  * Canvas exists but is hidden (`display: none`)
  * Game systems are initialized in the background

* **Active State**

  * After user click:

    * Overlay is hidden
    * Canvas becomes visible and fills screen
    * Game loop is fully observable via rendering
    * Audio playback begins

* **Player Interaction**

  * Initial interaction: click overlay to start
  * Ongoing interaction: handled via `Input` system inside game logic
  * All gameplay input is processed after activation

* **End State (Despawn / Reset / Destroy)**

  * No explicit shutdown is implemented
  * Session persists until page reload or navigation away
  * Canvas and loop remain active indefinitely

---

### Player Interaction

Player interaction is split into two phases:

* **Pre-game phase**

  * Single required action: click “Click to Start”
  * Unlocks audio and reveals gameplay canvas

* **Gameplay phase**

  * Input is handled through the engine’s `Input` system
  * Player actions affect game state (movement, actions, etc.)
  * Audio feedback and rendering respond in real time

---

### Rules / Mechanics

* Canvas is hidden until explicit user interaction occurs
* Audio playback is blocked until a gesture triggers it
* Game loop starts immediately on page load (not gated by overlay)
* Renderer is bound to a single `<canvas>` element
* Game logic is driven by a fixed update/render loop:

  * `update(dt)` → simulation step
  * `render(alpha)` → visual interpolation
* Audio assets are preloaded asynchronously but played only after interaction

---

### Feedback

* **Visual**

  * Black fullscreen background on load
  * Centered “Click to Start” overlay
  * Smooth transition from overlay → canvas gameplay view
  * Fullscreen canvas rendering after activation

* **Audio**

  * Background music (`bg.mp3`) starts at low volume after click
  * Sound effects (e.g. movement) available during gameplay

* **System**

  * Continuous frame updates via game loop
  * Responsive input-driven state changes reflected visually

---

### Variants (if any)

* Overlay could be extended into:

  * Main menu screen
  * Settings panel (volume, controls)
  * Level selection screen

* Canvas behavior could support:

  * Resizable rendering modes
  * Pause overlay layering
  * Debug visualization layers

---

### Edge Cases / Exceptions

* **Audio autoplay failure**

  * If user does not click, music cannot start due to browser restrictions

* **Missing DOM elements**

  * If `#canvas` or `#start-overlay` is missing, initialization may break

* **Asset loading delays**

  * Audio is loaded asynchronously; early gameplay may occur before full readiness

* **Game loop desync**

  * Large frame delays may cause inconsistent simulation steps

* **CSS display issues**

  * Canvas may remain hidden if overlay click handler fails

---

### Related Elements

* Renderer (`atari-monk-atom-engine`)
* Input system (`atari-monk-atom-engine`)
* Audio system (`atari-monk-atom-engine`)
* Game loop (`atari-monk-atom-engine`)
* Game core (`./oop/game`)
* Canvas element (`#canvas`)
* Start overlay (`#start-overlay`)

---

### Example (in-game scenario)

A player opens the page and sees a dark screen with “Click to Start”. They click it, the overlay disappears, the canvas expands to full screen, and soft background music begins. The game loop is already running, so the game world immediately responds with smooth rendering and input-driven interaction.