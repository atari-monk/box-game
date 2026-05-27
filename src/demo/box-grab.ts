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

    updateBoxFactory(state.boxFactory, dt, state.player.state);
    updateConveyorBelt(state.conveyor, dt);

    const playerState = state.player.state;

    if (state.input.isPressed("e")) {
        for (const box of state.boxFactory.boxes) {
            if (box.inGrid) continue;

            if (box.grabbedByPlayer) {
                box.grabbedByPlayer = false;
                break;
            }

            const grabRange = 80;

            const playerCenterX = playerState.x + playerState.size / 2;
            const playerCenterY = playerState.y + playerState.size / 2;

            const boxCenterX = box.x + box.width / 2;
            const boxCenterY = box.y + box.height / 2;

            const dx = playerCenterX - boxCenterX;
            const dy = playerCenterY - boxCenterY;

            if (Math.hypot(dx, dy) < grabRange) {
                box.grabbedByPlayer = true;
                box.offsetX = box.x - playerState.x;
                box.offsetY = box.y - playerState.y;
                box.speed = 0;

                break;
            }
        }

        state.input.clearPressed();
    }

    resolvePlayerRectCollisions(
        state.player.state,
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