import { createRect, renderRect, type RectState } from "./rect";
import {
    createPoint,
    renderPoint,
    type PointState
} from "./draw-point";

export type ConveyorBeltConfig = {
    centerX: number;
    centerY: number;
    length: number;
    width: number;
    gateWidth: number;
    gateHeight: number;
};

export type ConveyorBeltState = {
    config: ConveyorBeltConfig;
    belt: RectState;
    leftGate: RectState;
    rightGate: RectState;
    startX: number;
    endX: number;

    centerPoint: PointState;
    leftGatePoint: PointState;
    rightGatePoint: PointState;
    pointsEnabled: boolean;
};

export function createConveyorBelt(
    config: ConveyorBeltConfig
): ConveyorBeltState {
    const halfLength = config.length / 2;

    const belt = createRect(
        config.centerX - halfLength,
        config.centerY - config.width / 2,
        config.length,
        config.width,
        "blue"
    );

    const leftGate = createRect(
        config.centerX - halfLength - config.gateWidth,
        config.centerY - config.gateHeight / 2,
        config.gateWidth,
        config.gateHeight,
        "rgba(173, 216, 230, 1)"
    );

    const rightGate = createRect(
        config.centerX + halfLength,
        config.centerY - config.gateHeight / 2,
        config.gateWidth,
        config.gateHeight,
        "rgba(173, 216, 230, 1)"
    );

    const startX = leftGate.x + leftGate.width / 2;
    const endX = rightGate.x + rightGate.width / 2;

    const centerPoint = createPoint(
        config.centerX,
        config.centerY
    );

    const leftGatePoint = createPoint(
        leftGate.x + leftGate.width / 2,
        leftGate.y + leftGate.height / 2
    );

    const rightGatePoint = createPoint(
        rightGate.x + rightGate.width / 2,
        rightGate.y + rightGate.height / 2
    );

    return {
        config,
        belt,
        leftGate,
        rightGate,
        startX,
        endX,
        centerPoint,
        leftGatePoint,
        rightGatePoint,
        pointsEnabled: false
    };
}

export function updateConveyorBelt(
    _state: ConveyorBeltState,
    _dt: number
) { }

export function renderConveyorBelt(
    state: ConveyorBeltState,
    ctx: CanvasRenderingContext2D
) {
    renderRect(state.belt, ctx);

    if (!state.pointsEnabled) return;

    renderPoint(state.centerPoint, ctx);
}

export function renderConveyorGates(
    state: ConveyorBeltState,
    ctx: CanvasRenderingContext2D
) {
    renderRect(state.leftGate, ctx);
    renderRect(state.rightGate, ctx);

    if (!state.pointsEnabled) return;

    renderPoint(state.leftGatePoint, ctx);
    renderPoint(state.rightGatePoint, ctx);
}

export function getConveyorColliders(
    state: ConveyorBeltState
) {
    return [
        state.belt,
        state.leftGate,
        state.rightGate
    ];
}

export function toggleConveyorPoints(
    state: ConveyorBeltState
) {
    state.pointsEnabled = !state.pointsEnabled;
}