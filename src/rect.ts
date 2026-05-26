export type RectState = {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
};

export function createRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color = "white"
): RectState {
    return {
        x,
        y,
        width,
        height,
        color
    };
}

export function renderRect(
    rect: RectState,
    ctx: CanvasRenderingContext2D
) {
    ctx.fillStyle = rect.color;
    ctx.fillRect(
        rect.x,
        rect.y,
        rect.width,
        rect.height
    );
}