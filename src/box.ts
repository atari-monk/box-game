import type { Input } from "atari-monk-light-engine";
import type { PlayerState } from "./player";
import {
    type RectState,
    createRect,
    renderRect
} from "./rect";

export type BoxColor = "red" | "green" | "yellow" | "purple";

export type BoxState = RectState & {
    speed: number;
    grabbedByPlayer: boolean;
    inGrid: boolean;
    color: BoxColor;
    offsetX?: number;
    offsetY?: number;
};

export function createBox(
    x: number,
    y: number,
    color: BoxColor,
    size = 20,
    speed = 80
): BoxState {
    const colorMap = {
        red: "rgba(255,0,0,.5)",
        green: "rgba(0,255,0,.5)",
        yellow: "rgba(255,255,0,.5)",
        purple: "rgba(128,0,128,.5)"
    };

    return {
        ...createRect(
            x,
            y,
            size,
            size,
            colorMap[color]
        ),
        speed,
        grabbedByPlayer: false,
        inGrid: false,
        color
    };
}

export function updateBox(
    box: BoxState,
    dt: number,
    startX: number,
    endX: number,
    player?: PlayerState
) {
    if (box.grabbedByPlayer && player) {
        box.x = player.x + (box.offsetX ?? 0);
        box.y = player.y + (box.offsetY ?? 0);
        return;
    }

    if (box.speed === 0) return;

    box.x += box.speed * dt;

    if (box.x > endX) {
        box.x = startX;
    }
}

export function renderBox(
    box: BoxState,
    ctx: CanvasRenderingContext2D
) {
    renderRect(box, ctx);
}

export function handleBoxGrab(
    boxes: BoxState[],
    player: PlayerState,
    input: Input
) {
    if (!input.isPressed("e")) return;

    for (const box of boxes) {
        if (box.inGrid) continue;

        if (box.grabbedByPlayer) {
            box.grabbedByPlayer = false;
            break;
        }

        const grabRange = 80;

        const playerCenterX = player.x + player.size / 2;
        const playerCenterY = player.y + player.size / 2;

        const boxCenterX = box.x + box.width / 2;
        const boxCenterY = box.y + box.height / 2;

        const dx = playerCenterX - boxCenterX;
        const dy = playerCenterY - boxCenterY;

        if (Math.hypot(dx, dy) < grabRange) {
            box.grabbedByPlayer = true;
            box.offsetX = box.x - player.x;
            box.offsetY = box.y - player.y;
            box.speed = 0;

            break;
        }
    }

    input.clearPressed();
}