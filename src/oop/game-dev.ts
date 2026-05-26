import { type IGame, Renderer, Input, Audio } from "atari-monk-light-engine";
import {
    type GameState,
    createGame,
    updateGame,
    renderGame,
} from "../game-dev";

export class GameDev implements IGame {
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