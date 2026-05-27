import { type IGame, Renderer, Input, Audio } from "atari-monk-light-engine";
import { Player } from "./../oop/player";
import { resolvePlayerRectCollisions } from "./../rect-collision";
import {
    createConveyorBelt,
    renderConveyorBelt,
    updateConveyorBelt,
    getConveyorColliders,
    type ConveyorBeltState,
    toggleConveyorPoints
} from "./../conveyor-belt";
import type { RectState } from "../rect";
import { createBoxFactory, renderBoxFactory, updateBoxFactory, type BoxFactoryState } from "../box-factory";
import { handleBoxGrab } from "../box";

export class BoxGrabDemo implements IGame {
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
    conveyor: ConveyorBeltState;
    colliders: RectState[];
    boxFactory: BoxFactoryState;
};

function createGame(
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

    const boxFactory = createBoxFactory(conveyor, {
        maxBoxesOnConveyor: 4,
        spawnInterval: 1.5,
        boxSize: 20,
        boxSpeed: 80,
        spawnCounts: {
            red: 4,
            green: 4,
            yellow: 4,
            purple: 4
        }
    });

    return {
        renderer,
        input,
        audio,
        player: new Player(960 - 25, 350, 200, 50),
        conveyor,
        colliders: getConveyorColliders(conveyor),
        boxFactory,
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

    const playerState = state.player.state

    updateBoxFactory(state.boxFactory, dt, playerState);
    updateConveyorBelt(state.conveyor, dt);

    handleBoxGrab(
        state.boxFactory.boxes,
        playerState,
        state.input
    );

    resolvePlayerRectCollisions(
        playerState,
        state.colliders
    );

    if (state.input.isPressed("p")) {
        toggleConveyorPoints(state.conveyor);
        state.input.clearPressed();
    }
}

function renderGame(
    state: GameState,
    alpha: number
) {
    const ctx = state.renderer.ctx

    state.renderer.clear();

    renderConveyorBelt(state.conveyor, ctx);

    renderBoxFactory(state.boxFactory, state.renderer.ctx);

    state.player.render(
        ctx,
        alpha
    );
}