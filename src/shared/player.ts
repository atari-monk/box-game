import { Input } from "atari-monk-atom-engine";
import type { BoxState } from "./box";
import {
    type SpriteAnimatorState,
    createSpriteAnimator,
    renderSpriteAnimator,
    setSpriteAnimation,
    updateSpriteAnimator
} from "./sprite-animator";

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

    useSprite: boolean;
    sprite: SpriteAnimatorState;
};

export function createPlayer(
    x = 960 - 25,
    y = 350,
    speed = 200,
    size = 50,
    spriteSheet: HTMLImageElement
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
        grabRange: 80,
        useSprite: true,
        sprite: createSpriteAnimator(
            spriteSheet,
            256,
            256,
            [
                { row: 0, frames: 24, fps: 24 },
                { row: 1, frames: 24, fps: 24 },
                { row: 2, frames: 24, fps: 24 },
                { row: 3, frames: 24, fps: 24 },
                { row: 4, frames: 24, fps: 24 }
            ]
        )
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

    if (input.isDown("ArrowRight")) dx++;
    if (input.isDown("ArrowLeft")) dx--;
    if (input.isDown("ArrowUp")) dy--;
    if (input.isDown("ArrowDown")) dy++;

    const moving = dx !== 0 || dy !== 0;

    if (moving) {
        const length = Math.hypot(dx, dy);

        dx /= length;
        dy /= length;

        state.dirX = dx;
        state.dirY = dy;

        state.x += dx * state.speed * dt;
        state.y += dy * state.speed * dt;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal movement
            if (dx > 0) {
                setSpriteAnimation(state.sprite, 3); // walk right
                state.sprite.flipX = false;
            } else {
                setSpriteAnimation(state.sprite, 2); // walk left
                state.sprite.flipX = false;
            }
        } else {
            // Vertical movement
            if (dy > 0) {
                setSpriteAnimation(state.sprite, 1); // walk down
            } else {
                setSpriteAnimation(state.sprite, 4); // walk up
            }
            state.sprite.flipX = false;
        }

    } else {
        setSpriteAnimation(state.sprite, 0); // idle
    }

    updateSpriteAnimator(state.sprite, dt);

    return moving;
}

export function renderPlayer(
    state: PlayerState,
    ctx: CanvasRenderingContext2D,
    alpha: number
) {
    const x = state.prevX + (state.x - state.prevX) * alpha;
    const y = state.prevY + (state.y - state.prevY) * alpha;

    if (state.useSprite)
        renderSpriteAnimator(
            state.sprite,
            ctx,
            x,
            y,
            state.size,
            state.size
        );
    else
        renderRect(ctx, x, y, state);
}

function renderRect(ctx: CanvasRenderingContext2D, x: number, y: number, state: PlayerState) {
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