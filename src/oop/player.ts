import {
    type PlayerState,
    createPlayer,
    updatePlayer,
    renderPlayer
} from "../player";

import { Input } from "atari-monk-light-engine";

export class Player {
    private state: PlayerState;

    constructor(
        x = 100,
        y = 200,
        speed = 200,
        size = 50
    ) {
        this.state = createPlayer(x, y, speed, size);
    }

    update(dt: number, input: Input) {
        return updatePlayer(this.state, dt, input);
    }

    render(ctx: CanvasRenderingContext2D, alpha: number) {
        renderPlayer(this.state, ctx, alpha);
    }

    get x() {
        return this.state.x;
    }

    get y() {
        return this.state.y;
    }

    set x(value: number) {
        this.state.x = value;
    }

    set y(value: number) {
        this.state.y = value;
    }
}