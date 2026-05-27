import { type IGame, Renderer, Input, Audio } from "atari-monk-light-engine";
import { Player } from "./../oop/player";
import { resolvePlayerRectCollisions } from "./../rect-collision";
import { createBox, renderBox, updateBox, type BoxState } from "../box";
import type { RectState } from "../rect";

export class BoxDemo implements IGame {
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
    boxes: BoxState[];
    colliders: RectState[];
};

function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {
    const boxes = [
        createBox(650, 200, "red"),
        createBox(650, 230, "green"),
        createBox(650, 260, "yellow"),
        createBox(650, 290, "purple")
    ];

    return {
        renderer,
        input,
        audio,
        player: new Player(960 - 25, 350, 200, 50),
        boxes,
        colliders: [
            ...boxes
        ],
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

    for (const box of state.boxes) {
        updateBox(box, dt, 650, 650 + 300);
    }

    resolvePlayerRectCollisions(
        state.player.state,
        state.colliders
    );
}

function renderGame(
    state: GameState,
    alpha: number
) {
    const ctx = state.renderer.ctx

    state.renderer.clear();

    for (const box of state.boxes) {
        renderBox(box, state.renderer.ctx);
    }

    state.player.render(
        ctx,
        alpha
    );
}