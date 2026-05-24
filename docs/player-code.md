# Basic/Prototype Player Code

## Procedural Player

```ts
// FILE: src/player.ts
import { Input } from "atari-monk-light-engine";

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

## OOP Player

```ts
// FILE: src/oop/player.ts
import {
    type PlayerState,
    createPlayer,
    updatePlayer,
    renderPlayer
} from "../player";

import { Input } from "atari-monk-light-engine";

export class Player {
    private state: PlayerState;

    constructor(
        x = 100,
        y = 200,
        speed = 200,
        size = 50
    ) {
        this.state = createPlayer(x, y, speed, size);
    }

    update(dt: number, input: Input) {
        return updatePlayer(this.state, dt, input);
    }

    render(ctx: CanvasRenderingContext2D, alpha: number) {
        renderPlayer(this.state, ctx, alpha);
    }

    get x() {
        return this.state.x;
    }

    get y() {
        return this.state.y;
    }

    set x(value: number) {
        this.state.x = value;
    }

    set y(value: number) {
        this.state.y = value;
    }
}
```

## Game integration

```ts
// FILE: src/game.ts
import type { Renderer, Input, Audio } from "atari-monk-light-engine";
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
        player: new Player()
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
    state.renderer.clear();

    state.player.render(
        state.renderer.ctx,
        alpha
    );
}

export function startGameMusic(state: GameState) {
    state.audio.playMusic("bg", 0.5);
}
```