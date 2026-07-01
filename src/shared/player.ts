import { Input } from "atari-monk-atom-engine";
import type { BoxState } from "./box";

export type PlayerState = {
    x: number;
    y: number;

    prevX: number;
    prevY: number;

    dirX: number;
    dirY: number;

    speed: number;
    size: number;

    grabRange: number;
};

export function createPlayer(
    x = 960 - 25,
    y = 350,
    speed = 200,
    size = 50
): PlayerState {
    return {
        x,
        y,
        prevX: x,
        prevY: y,
        dirX: 1,
        dirY: 0,
        speed,
        size,
        grabRange: 80
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

        state.dirX = dx;
        state.dirY = dy;

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
    const x = state.prevX + (state.x - state.prevX) * alpha;
    const y = state.prevY + (state.y - state.prevY) * alpha;

    ctx.fillStyle = "red";
    ctx.fillRect(x, y, state.size, state.size);

    const centerX = x + state.size / 2;
    const centerY = y + state.size / 2;

    const length = state.size * 0.6;
    const width = state.size * 0.2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(Math.atan2(state.dirY, state.dirX));

    ctx.fillStyle = "black";
    ctx.fillRect(0, -width / 2, length, width);

    ctx.restore();
}

export function handleBoxGrab(state: PlayerState, boxes: BoxState[]) {
    for (const box of boxes) {
        if (box.inGrid) continue;

        if (box.grabbedByPlayer) {
            box.grabbedByPlayer = false;
            break;
        }

        const playerCenterX = state.x + state.size / 2;
        const playerCenterY = state.y + state.size / 2;

        const boxCenterX = box.x + box.width / 2;
        const boxCenterY = box.y + box.height / 2;

        const dx = playerCenterX - boxCenterX;
        const dy = playerCenterY - boxCenterY;

        if (Math.hypot(dx, dy) < state.grabRange) {
            box.grabbedByPlayer = true;
            box.offsetX = box.x - state.x;
            box.offsetY = box.y - state.y;
            box.speed = 0;

            break;
        }
    }
}