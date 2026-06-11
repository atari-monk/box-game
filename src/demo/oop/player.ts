import { type IUpdatable, type IRenderable, Renderer, Input, Audio } from "atari-monk-atom-engine";
import { createGame, renderGame, updateGame, type GameState } from "./../player";

export class PlayerDemo implements IUpdatable, IRenderable {
    private state: GameState;

    constructor(
        renderer: Renderer,
        input: Input,
        audio: Audio
    ) {
        this.state = createGame(renderer, input, audio);
    }

    update(dt: number) {
        updateGame(this.state, dt);
    }

    render(alpha: number) {
        renderGame(this.state, alpha);
    }
}