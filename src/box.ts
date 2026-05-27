import {
    type RectState,
    createRect,
    renderRect
} from "./rect";

export type BoxState = RectState & {
    speed: number;
};

export function createBox(
    x: number,
    y: number,
    size = 20,
    speed = 80
): BoxState {
    return {
        ...createRect(
            x,
            y,
            size,
            size,
            "rgba(255,0,0,.5)"
        ),
        speed
    };
}

export function updateBox(
    box: BoxState,
    dt: number,
    startX: number,
    endX: number
) {
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