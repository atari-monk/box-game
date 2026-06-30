export type RectState = {
    x: number;
    y: number;
    width: number;
    height: number;
    baseWidth: number;
    baseHeight: number;
    color: string;
    time: number;
    speed: number;
    scale: number;
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
        baseWidth: width,
        baseHeight: height,
        color,
        time: 0,
        speed: 3,
        scale: 1
    };
}

export function updateRect(rect: RectState, dt: number) {
    rect.time += dt;

    rect.scale = 1 + Math.sin(rect.time * rect.speed) * 0.9;
}

export function renderRect(
    rect: RectState,
    ctx: CanvasRenderingContext2D
) {
    const w = rect.baseWidth * rect.scale;
    const h = rect.baseHeight * rect.scale;

    const dx = rect.x - (w - rect.baseWidth) / 2;
    const dy = rect.y - (h - rect.baseHeight) / 2;

    ctx.fillStyle = rect.color;
    ctx.fillRect(dx, dy, w, h);
}