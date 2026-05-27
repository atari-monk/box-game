import { type IGame, Renderer, Input, Audio } from "atari-monk-light-engine";
import { Player } from "./../oop/player";

export class PlayerDemo implements IGame {
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

type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
};

function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {
    return {
        renderer,
        input,
        audio,
        player: new Player(960 - 25, 350, 200, 50)
    };
}

function updateGame(
    state: GameState,
    dt: number
) {
    const moved = state.player.update(dt, state.input);

    if (moved) {
        state.audio.play("move");
    }
}

function renderGame(
    state: GameState,
    alpha: number
) {
    const ctx = state.renderer.ctx

    state.renderer.clear();

    state.player.render(
        ctx,
        alpha
    );
}