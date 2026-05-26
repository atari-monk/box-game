import type { Renderer, Input, Audio } from "atari-monk-light-engine";
import { Player } from "./oop/player";
import { Rect } from "./oop/rect";
import { resolvePlayerRectCollisions } from "./rect-collision";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
    rect_a: Rect;
    rect_b: Rect;
    rect_c: Rect;
    rect_d: Rect;
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
        rect_b: new Rect(400 + 140, 200, 120, 80, "blue"),
        rect_c: new Rect(400, 200 + 200, 120, 80, "blue"),
        rect_d: new Rect(400 + 140, 200 + 200, 120, 80, "blue")
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

    resolvePlayerRectCollisions(
        state.player.state,
        [state.rect_c.state, state.rect_d.state]
    );
}

export function renderGame(
    state: GameState,
    alpha: number
) {
    const ctx = state.renderer.ctx

    state.renderer.clear();

    state.rect_a.render(ctx);
    state.rect_c.render(ctx);

    state.player.render(
        ctx,
        alpha
    );

    state.rect_b.render(ctx);
    state.rect_d.render(ctx);
}