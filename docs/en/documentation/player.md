## Player

### Purpose / Design Intent

The Player is the primary controllable entity in the game. It represents a movable square that responds to keyboard input and is rendered with smooth interpolation for visually fluid motion.

### Description

The Player is implemented as a thin OOP wrapper (`Player` class) around a functional state model (`PlayerState`). It tracks position, previous position (for interpolation), movement speed, and size. The player moves in four directions using arrow key input and is rendered as a red square on a 2D canvas.

The system is split into:
- **State creation (`createPlayer`)**
- **Logic update (`updatePlayer`)**
- **Rendering (`renderPlayer`)**
- **OOP wrapper (`Player` class)**

### Game Lifecycle
- **Appearance / Spawn**
  - The player is instantiated during game initialization in `createGame`.
  - Default spawn position is `x = 935`, `y = 350` (derived from `960 - 25`), with `speed = 200` and `size = 50`.

- **Active State**
  - The player continuously updates each frame via `update(dt, input)`.
  - Movement is based on real-time keyboard input.
  - Previous position is stored each frame to support interpolation.

- **Player Interaction**
  - Controlled via arrow keys:
    - ArrowRight → move right
    - ArrowLeft → move left
    - ArrowUp → move up
    - ArrowDown → move down
  - Movement is normalized for diagonal input to prevent faster diagonal motion.

- **End State (Despawn / Reset / Destroy)**
  - No explicit destruction logic exists.
  - The player persists for the duration of the game state unless manually replaced or reset by the engine.

### Player Interaction

The player sees a red square that moves smoothly across the screen in response to arrow key input. Movement feels responsive due to delta-time scaling and interpolation-based rendering, which reduces visual stutter between updates.

When movement occurs, the system triggers a "move" audio event via the game layer, providing immediate feedback.

### Rules / Mechanics

- Movement is frame-rate independent using `dt * speed`.
- Diagonal movement is normalized using vector length (`Math.hypot`) to ensure consistent speed in all directions.
- Position updates only occur when at least one movement key is pressed.
- Previous position is stored before each update for interpolation purposes.
- Rendering uses linear interpolation between `prevX/prevY` and `x/y` using an `alpha` factor.

### Feedback

- **Visual**
  - Player is rendered as a red square (`fillStyle = "red"`).
  - Smooth motion is achieved via interpolation.

- **Audio**
  - A "move" sound is played whenever the player changes position.

- **System Feedback**
  - Movement detection returns a boolean indicating whether movement occurred in the frame.

### Variants (if any)

- No gameplay variants are defined in the current implementation.
- The structure allows future extension (e.g., different player types with alternate speed, size, or input handling).

### Edge Cases / Exceptions

- If no directional input is active, the player does not move and no audio is triggered.
- When moving diagonally, normalization prevents speed amplification.
- Extremely small `dt` values result in minimal movement but remain stable due to linear scaling.
- If input system does not register a key state correctly, movement may be non-responsive for that frame.

### Related Elements

- Game state system (`createGame`, `updateGame`, `renderGame`)
- Input system (`Input` from engine)
- Audio system (`Audio` from engine)
- Renderer system (`Renderer` with CanvasRenderingContext2D)

### Example (in-game scenario)

The game starts and the player appears near the right side of the screen as a red square. The player presses the Right Arrow key and the square begins moving smoothly to the right. As movement starts, a "move" sound plays. Holding the Up Arrow simultaneously causes diagonal movement, but the speed remains consistent due to normalization. When keys are released, the player stops immediately, and no further audio is triggered, while the last movement smoothly interpolates into a resting position on the next render frames.