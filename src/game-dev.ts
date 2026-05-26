import type { Renderer, Input, Audio } from "atari-monk-light-engine";
import { Player } from "./oop/player";
import { Rect } from "./oop/rect";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
    rect_a: Rect;
    rect_b: Rect;
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
        player: new Player(),
        rect_a: new Rect(400, 200, 120, 80, "blue"),
        rect_b: new Rect(400 + 140, 200, 120, 80, "blue")
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
    state.renderer.clear();

    state.rect_a.render(state.renderer.ctx);

    state.player.render(
        state.renderer.ctx,
        alpha
    );

    state.rect_b.render(state.renderer.ctx);
}