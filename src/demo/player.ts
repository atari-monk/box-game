import { Renderer, Input, Audio } from "atari-monk-atom-engine";
import { Player } from "./../oop/player";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
};

export function createGame(
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

export function updateGame(
    state: GameState,
    dt: number
) {
    const moved = state.player.update(dt, state.input);

    if (moved) {
        state.audio.play("move");
    }
}

export function renderGame(
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