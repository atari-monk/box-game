import { Rect } from "./oop/rect";
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
    belt: Rect;
    leftGate: Rect;
    rightGate: Rect;
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

    const belt = new Rect(
        config.centerX - halfLength,
        config.centerY - config.width / 2,
        config.length,
        config.width,
        "blue"
    );

    const leftGate = new Rect(
        config.centerX - halfLength - config.gateWidth,
        config.centerY - config.gateHeight / 2,
        config.gateWidth,
        config.gateHeight,
        "rgba(173, 216, 230, .5)"
    );

    const rightGate = new Rect(
        config.centerX + halfLength,
        config.centerY - config.gateHeight / 2,
        config.gateWidth,
        config.gateHeight,
        "rgba(173, 216, 230, .5)"
    );

    const startX = leftGate.state.x + leftGate.state.width / 2;
    const endX = rightGate.state.x + rightGate.state.width / 2;

    const centerPoint = createPoint(
        config.centerX,
        config.centerY
    );

    const leftGatePoint = createPoint(
        leftGate.state.x + leftGate.state.width / 2,
        leftGate.state.y + leftGate.state.height / 2
    );

    const rightGatePoint = createPoint(
        rightGate.state.x + rightGate.state.width / 2,
        rightGate.state.y + rightGate.state.height / 2
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
    state: ConveyorBeltState,
    dt: number
) { }

export function renderConveyorBelt(
    state: ConveyorBeltState,
    ctx: CanvasRenderingContext2D
) {
    state.belt.render(ctx);
    state.leftGate.render(ctx);
    state.rightGate.render(ctx);

    if (!state.pointsEnabled) return;

    renderPoint(state.centerPoint, ctx);
    renderPoint(state.leftGatePoint, ctx);
    renderPoint(state.rightGatePoint, ctx);
}

export function getConveyorColliders(
    state: ConveyorBeltState
) {
    return [
        state.belt.state,
        state.leftGate.state,
        state.rightGate.state
    ];
}

export function toggleConveyorPoints(
    state: ConveyorBeltState
) {
    state.pointsEnabled = !state.pointsEnabled;
}