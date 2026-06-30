import type { Renderer, Input, Audio } from "atari-monk-atom-engine";
import { createRect, renderRect, updateRect, type RectState } from "./shared/rect";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    rect: RectState;
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
        rect: createRect(960 - 50, 540 - 50, 100, 100),
    };
}

export function updateGame(
    state: GameState,
    dt: number
) {
    updateRect(state.rect, dt);
}

export function renderGame(
    state: GameState,
    _alpha: number
) {
    const ctx = state.renderer.ctx

    state.renderer.clear();

    renderRect(
        state.rect,
        ctx
    );
}