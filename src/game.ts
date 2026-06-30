import type { Renderer, Input, Audio } from "atari-monk-atom-engine";
import { createPlayer, renderPlayer, updatePlayer, type PlayerState } from "./shared/player";
import { createRect, renderRect, type RectState } from "./shared/rect";
import { resolvePlayerRectCollisions } from "./shared/collision";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: PlayerState;
    rect: RectState
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
        player: createPlayer(960 - 25, 540 - 25 - 100, 200, 50),
        rect: createRect(960 - 25, 540 - 25, 50, 50, "yellow")
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

    resolvePlayerRectCollisions(
        state.player,
        [state.rect]
    );
}

export function renderGame(
    state: GameState,
    alpha: number
) {
    const ctx = state.renderer.ctx

    state.renderer.clear();

    renderRect(state.rect, ctx);

    renderPlayer(
        state.player,
        ctx,
        alpha
    );
}