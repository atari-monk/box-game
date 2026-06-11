## Setup Game - Implementation

Code to start new game project with atom-engine

## Content

- [Main Page](#main-page)
- [Basic Player](#basic-player)
- [Game Loop](#game-loop)
- [Main Entrypoint](#main-entrypoint)

### Main Page

index.html

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Box Game</title>
</head>

<div id="start-overlay">
  Click to Start
</div>
<canvas id="canvas"></canvas>

<body>
  <script type="module" src="/src/main.ts"></script>
</body>

</html>
```

src/style.css

```css
html,
body {
    margin: 0;
    overflow: hidden;
    background: black;
    height: 100%;
}

canvas {
    display: none;
    width: 100%;
    height: 100%;
}

#start-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    cursor: pointer;
    z-index: 9999;
}
```

[Content](#content)

### Basic Player

src/player.ts

```ts
import { Input } from "atari-monk-atom-engine";

export type PlayerState = {
    x: number;
    y: number;

    prevX: number;
    prevY: number;

    speed: number;
    size: number;
};

export function createPlayer(
    x = 100,
    y = 200,
    speed = 200,
    size = 50
): PlayerState {
    return {
        x,
        y,
        prevX: x,
        prevY: y,
        speed,
        size,
    };
}

export function updatePlayer(
    state: PlayerState,
    dt: number,
    input: Input
): boolean {
    state.prevX = state.x;
    state.prevY = state.y;

    let dx = 0;
    let dy = 0;

    if (input.isDown("ArrowRight")) dx += 1;
    if (input.isDown("ArrowLeft")) dx -= 1;
    if (input.isDown("ArrowUp")) dy -= 1;
    if (input.isDown("ArrowDown")) dy += 1;

    if (dx !== 0 || dy !== 0) {
        const length = Math.hypot(dx, dy);

        dx /= length;
        dy /= length;

        state.x += dx * state.speed * dt;
        state.y += dy * state.speed * dt;

        return true;
    }

    return false;
}

export function renderPlayer(
    state: PlayerState,
    ctx: CanvasRenderingContext2D,
    alpha: number
) {
    const interpolatedX =
        state.prevX + (state.x - state.prevX) * alpha;

    const interpolatedY =
        state.prevY + (state.y - state.prevY) * alpha;

    ctx.fillStyle = "red";
    ctx.fillRect(
        interpolatedX,
        interpolatedY,
        state.size,
        state.size
    );
}
```

src/oop/player.ts

```ts
import {
    type PlayerState,
    createPlayer,
    updatePlayer,
    renderPlayer
} from "../player";

import { Input } from "atari-monk-atom-engine";

export class Player {
    private _state: PlayerState;

    get state() {
        return this._state;
    }

    constructor(
        x = 100,
        y = 200,
        speed = 200,
        size = 50
    ) {
        this._state = createPlayer(x, y, speed, size);
    }

    update(dt: number, input: Input) {
        return updatePlayer(this._state, dt, input);
    }

    render(ctx: CanvasRenderingContext2D, alpha: number) {
        renderPlayer(this._state, ctx, alpha);
    }

    get x() {
        return this._state.x;
    }

    get y() {
        return this._state.y;
    }

    set x(value: number) {
        this._state.x = value;
    }

    set y(value: number) {
        this._state.y = value;
    }
}
```

[Content](#content)

### Game Loop

src/game.ts

```ts
import type { Renderer, Input, Audio } from "atari-monk-atom-engine";
import { Player } from "./oop/player";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
};

export function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {
    return {
        renderer,
        input,
        audio,
        player: new Player(960 - 25, 350, 200, 50),
    };
}

export function updateGame(
    state: GameState,
    dt: number
) {
    const moved = state.player.update(dt, state.input);

    if (moved) {
        state.audio.play("move");
    }
}

export function renderGame(
    state: GameState,
    alpha: number
) {
    const ctx = state.renderer.ctx

    state.renderer.clear();

    state.player.render(
        ctx,
        alpha
    );
}
```

src/oop/game.ts

```ts
import { type IUpdatable, type IRenderable, Renderer, Input, Audio } from "atari-monk-atom-engine";
import {
    type GameState,
    createGame,
    updateGame,
    renderGame,
} from "../game";

export class Game implements IUpdatable, IRenderable {
    private state: GameState;

    constructor(
        renderer: Renderer,
        input: Input,
        audio: Audio
    ) {
        this.state = createGame(renderer, input, audio);
    }

    update(dt: number) {
        updateGame(this.state, dt);
    }

    render(alpha: number) {
        renderGame(this.state, alpha);
    }
}
```

[Content](#content)

### Main Entrypoint

src/main.ts

```ts
import './style.css'
import {
    Renderer,
    Input,
    Audio,
    GameLoop
} from "atari-monk-atom-engine";
import { Game } from "./oop/game";

const renderer = new Renderer("canvas");
const input = new Input();

const audio = new Audio();

(async () => {
    await audio.load("move", "./sounds/move.wav");
    await audio.load("bg", "./sounds/bg.mp3");
})();

const game = new Game(renderer, input, audio);

const overlay = document.getElementById("start-overlay");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

overlay?.addEventListener("click", async () => {
    overlay.style.display = "none";
    canvas.style.display = "block";

    await audio.playMusicAfterGesture("bg", 0.5);
});

const loop = new GameLoop(
    (dt) => game.update(dt),
    (alpha) => game.render(alpha)
);

loop.start();
```

[Content](#content)