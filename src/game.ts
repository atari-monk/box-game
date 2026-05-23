import type { Renderer, Input, Audio } from "atari-monk-light-engine";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
};

export function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {
    return {
        renderer,
        input,
        audio
    };
}

export function updateGame(
    state: GameState,
    dt: number
) {
}

export function renderGame(
    state: GameState,
    alpha: number
) {
    state.renderer.clear();
}

export function startGameMusic(state: GameState) {
    state.audio.playMusic("bg", 0.5);
}