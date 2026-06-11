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