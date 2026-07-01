import { createRect, renderRect, type RectState } from "./rect";

export type PointState = {
    horizontal: RectState;
    vertical: RectState;
};

export function createPoint(
    x: number,
    y: number,
    size = 20,
    thickness = 4,
    color = "rgba(255,0,0,0.5)"
): PointState {
    const horizontal = createRect(
        x - size / 2,
        y - thickness / 2,
        size,
        thickness,
        color
    );

    const vertical = createRect(
        x - thickness / 2,
        y - size / 2,
        thickness,
        size,
        color
    );

    return {
        horizontal,
        vertical
    };
}

export function renderPoint(
    point: PointState,
    ctx: CanvasRenderingContext2D
) {
    renderRect(point.horizontal, ctx);
    renderRect(point.vertical, ctx);
}