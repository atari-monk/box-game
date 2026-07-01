import type { Renderer, Input, Audio } from "atari-monk-atom-engine";
import { createPlayer, handleBoxGrab, renderPlayer, updatePlayer, type PlayerState } from "./shared/player";
import { resolvePlayerRectCollisions } from "./shared/collision";
import { createConveyorBelt, getConveyorColliders, renderConveyorBelt, renderConveyorGates, toggleConveyorPoints, updateConveyorBelt, type ConveyorBeltState } from "./shared/conveyor-belt";
import type { RectState } from "./shared/rect";
import {
    createBoxFactory,
    renderBoxFactory,
    updateBoxFactory,
    type BoxFactoryState
} from "./shared/box-factory";
import {
    createGridCluster,
    updateGridCluster,
    renderGridCluster,
    type GridCluster,
    toggleClusterPoint
} from "./shared/box-grid-cluster";
import { fillGrids } from "./shared/box-gird";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: PlayerState;
    conveyor: ConveyorBeltState;
    colliders: RectState[];
    boxFactory: BoxFactoryState;
    boxGridCluster: GridCluster;
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

    const boxGridCluster = createGridCluster(960, 400, 25, 2, 2, 200, 100);

    return {
        renderer,
        input,
        audio,
        player: createPlayer(960 - 25, 540 - 25 - 100, 200, 50),
        conveyor,
        colliders: getConveyorColliders(conveyor),
        boxFactory,
        boxGridCluster,
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

    updateBoxFactory(state.boxFactory, dt, state.player);
    updateGridCluster(state.boxGridCluster, state.boxFactory.boxes);
    updateConveyorBelt(state.conveyor, dt);

    resolvePlayerRectCollisions(
        state.player,
        state.colliders
    );

    if (state.input.isPressed("e")) {
        handleBoxGrab(state.player, state.boxFactory.boxes);
        state.input.clearPressed();
    }

    if (state.input.isPressed("f")) {
        fillGrids(state.boxGridCluster.grids, state.boxFactory.boxes);
        state.input.clearPressed();
    }

    if (state.input.isPressed("p")) {
        toggleConveyorPoints(state.conveyor);
        toggleClusterPoint(state.boxGridCluster);
        state.input.clearPressed();
    }
}

export function renderGame(
    state: GameState,
    alpha: number
) {
    const ctx = state.renderer.ctx

    state.renderer.clear();

    renderConveyorBelt(state.conveyor, state.renderer.ctx);
    renderGridCluster(state.boxGridCluster, state.renderer.ctx);
    renderBoxFactory(state.boxFactory, state.renderer.ctx);
    renderConveyorGates(state.conveyor, state.renderer.ctx);

    renderPlayer(
        state.player,
        ctx,
        alpha
    );
}