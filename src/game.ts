import type { Renderer, Input, Audio } from "atari-monk-atom-engine";
import { createPlayer, renderPlayer, updatePlayer, type PlayerState } from "./shared/player";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: PlayerState;
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
        player: createPlayer(960 - 25, 540 - 25, 200, 50),
    };
}

export function updateGame(
    state: GameState,
    dt: number
) {
    const moved = updatePlayer(state.player, dt, state.input);
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

    renderPlayer(
        state.player,
        ctx,
        alpha
    );
}