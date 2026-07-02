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
import {
    createLift,
    updateLift,
    renderLift,
    type LiftState
} from "./shared/workshop-lift";
import {
    type ZoneState,
    createZonesRow,
    updateZones,
    renderZones
} from "./shared/zone";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: PlayerState;
    conveyor: ConveyorBeltState;
    colliders: RectState[];
    boxFactory: BoxFactoryState;
    boxGridCluster: GridCluster;
    lift: LiftState;
    zones: ZoneState[];
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
    const playerSize = 50;
    const lift = createLift(700, 400, playerSize);

    const zones = createZonesRow(
        960,
        990,
        80,
        20
    );

    return {
        renderer,
        input,
        audio,
        player: createPlayer(960 - 25, 540 - 25 - 100, 200, playerSize),
        conveyor,
        colliders: getConveyorColliders(conveyor),
        boxFactory,
        boxGridCluster,
        lift,
        zones
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
    updateLift(state.lift, state.player, state.input, state.boxGridCluster.grids);
    updateZones(state.zones, state.boxGridCluster.grids, state.lift.carriedGrid);

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

    renderConveyorBelt(state.conveyor, ctx);
    renderLift(state.lift, ctx);
    renderZones(state.zones, ctx);
    renderGridCluster(state.boxGridCluster, ctx);
    renderBoxFactory(state.boxFactory, ctx);
    renderConveyorGates(state.conveyor, ctx);
    renderPlayer(state.player, ctx, alpha);
}