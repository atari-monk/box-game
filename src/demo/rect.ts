import { type IGame, Renderer, Input, Audio } from "atari-monk-light-engine";
import { Player } from "./../oop/player";
import { Rect } from "./../oop/rect";
import { resolvePlayerRectCollisions } from "./../rect-collision";

export class RectDemo implements IGame {
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
    rect_a: Rect;
    rect_b: Rect;
    rect_c: Rect;
    rect_d: Rect;
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
        player: new Player(960 - 25, 350, 200, 50),
        rect_a: new Rect(400, 200, 120, 80, "blue"),
        rect_b: new Rect(400 + 140, 200, 120, 80, "blue"),
        rect_c: new Rect(400, 200 + 200, 120, 80, "blue"),
        rect_d: new Rect(400 + 140, 200 + 200, 120, 80, "blue")
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

    resolvePlayerRectCollisions(
        state.player.state,
        [state.rect_c.state, state.rect_d.state]
    );
}

function renderGame(
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