import {
    type PlayerState,
    createPlayer,
    updatePlayer,
    renderPlayer
} from "../player";

import { Input } from "atari-monk-atom-engine";

export class Player {
    private _state: PlayerState;

    get state() {
        return this._state;
    }

    constructor(
        x = 100,
        y = 200,
        speed = 200,
        size = 50
    ) {
        this._state = createPlayer(x, y, speed, size);
    }

    update(dt: number, input: Input) {
        return updatePlayer(this._state, dt, input);
    }

    render(ctx: CanvasRenderingContext2D, alpha: number) {
        renderPlayer(this._state, ctx, alpha);
    }

    get x() {
        return this._state.x;
    }

    get y() {
        return this._state.y;
    }

    set x(value: number) {
        this._state.x = value;
    }

    set y(value: number) {
        this._state.y = value;
    }
}