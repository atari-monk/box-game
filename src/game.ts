import type { Renderer, Input, Audio } from "atari-monk-atom-engine";
import { createPlayer, renderPlayer, updatePlayer, type PlayerState } from "./shared/player";
import { resolvePlayerRectCollisions } from "./shared/collision";
import { createConveyorBelt, getConveyorColliders, renderConveyorBelt, updateConveyorBelt, type ConveyorBeltState } from "./shared/conveyor-belt";
import type { RectState } from "./shared/rect";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: PlayerState;
    conveyor: ConveyorBeltState;
    colliders: RectState[];
};

export function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {

    const conveyor = createConveyorBelt({
        centerX: 960,
        centerY: 60,
        length: 700,
        width: 40,
        gateWidth: 100,
        gateHeight: 100
    });

    return {
        renderer,
        input,
        audio,
        player: createPlayer(960 - 25, 540 - 25 - 100, 200, 50),
        conveyor,
        colliders: getConveyorColliders(conveyor),
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

    updateConveyorBelt(state.conveyor, dt);

    resolvePlayerRectCollisions(
        state.player,
        state.colliders
    );
}

export function renderGame(
    state: GameState,
    alpha: number
) {
    const ctx = state.renderer.ctx

    state.renderer.clear();

    renderConveyorBelt(state.conveyor, state.renderer.ctx);

    renderPlayer(
        state.player,
        ctx,
        alpha
    );
}