import {
    type RectState,
    createRect,
    renderRect
} from "../rect";

export class Rect {
    private _state: RectState;

    get state() {
        return this._state;
    }

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        color = "white"
    ) {
        this._state = createRect(x, y, width, height, color);
    }

    render(ctx: CanvasRenderingContext2D) {
        renderRect(this._state, ctx);
    }
}