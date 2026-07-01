import { createBox, renderBox, updateBox, type BoxState, type BoxColor } from "./box";
import type { ConveyorBeltConfig } from "./conveyor-belt";
import type { PlayerState } from "./player";

export type BoxFactoryConfig = {
    maxBoxesOnConveyor: number;
    spawnInterval: number;
    boxSize: number;
    boxSpeed: number;
    spawnCounts: {
        red: number;
        green: number;
        yellow: number;
        purple: number;
    };
};

export type BoxFactoryState = {
    boxes: BoxState[];
    conveyorStartX: number;
    conveyorEndX: number;
    conveyorCenterY: number;
    conveyorWidth: number;
    lanes: number[];
    spawnTimer: number;
    config: BoxFactoryConfig;
    spawnCountsLeft: {
        red: number;
        green: number;
        yellow: number;
        purple: number;
    };
};

export function createBoxFactory(
    conveyor: {
        startX: number;
        endX: number;
        config: ConveyorBeltConfig;
    },
    config: BoxFactoryConfig
): BoxFactoryState {
    const lanes = createLanes(conveyor.config);

    return {
        boxes: [],
        conveyorStartX: conveyor.startX,
        conveyorEndX: conveyor.endX,
        conveyorCenterY: conveyor.config.centerY,
        conveyorWidth: conveyor.config.width,
        lanes,
        spawnTimer: 0,
        config,
        spawnCountsLeft: {
            red: config.spawnCounts.red,
            green: config.spawnCounts.green,
            yellow: config.spawnCounts.yellow,
            purple: config.spawnCounts.purple
        }
    };
}

export function updateBoxFactory(
    factory: BoxFactoryState,
    dt: number,
    player?: PlayerState
) {
    for (const box of factory.boxes) {
        updateBox(
            box,
            dt,
            factory.conveyorStartX,
            factory.conveyorEndX,
            player
        );
    }

    factory.boxes = factory.boxes.filter(
        box => box.x < factory.conveyorEndX
    );

    factory.spawnTimer += dt;

    const spawnCountsLeft = factory.spawnCountsLeft;

    const totalBoxesToSpawn =
        spawnCountsLeft.red +
        spawnCountsLeft.green +
        spawnCountsLeft.yellow +
        spawnCountsLeft.purple;

    if (
        totalBoxesToSpawn > 0 &&
        factory.spawnTimer >= factory.config.spawnInterval &&
        countBoxesOnConveyor(factory) < factory.config.maxBoxesOnConveyor
    ) {
        factory.spawnTimer = 0;

        const laneIndex = Math.floor(Math.random() * factory.lanes.length);
        const y = factory.lanes[laneIndex];

        const colorRandom = Math.random() * totalBoxesToSpawn;
        let color: BoxColor;

        if (colorRandom < spawnCountsLeft.red) {
            color = "red";
            spawnCountsLeft.red--;
        } else if (
            colorRandom < spawnCountsLeft.red + spawnCountsLeft.green
        ) {
            color = "green";
            spawnCountsLeft.green--;
        } else if (
            colorRandom <
            spawnCountsLeft.red + spawnCountsLeft.green + spawnCountsLeft.yellow
        ) {
            color = "yellow";
            spawnCountsLeft.yellow--;
        } else {
            color = "purple";
            spawnCountsLeft.purple--;
        }

        const box = createBox(
            factory.conveyorStartX,
            y,
            color,
            factory.config.boxSize,
            factory.config.boxSpeed
        );

        factory.boxes.push(box);
    }
}

export function renderBoxFactory(
    factory: BoxFactoryState,
    ctx: CanvasRenderingContext2D
) {
    for (const box of factory.boxes) {
        renderBox(box, ctx);
    }
}

function countBoxesOnConveyor(factory: BoxFactoryState): number {
    let count = 0;

    for (const box of factory.boxes) {
        if (!box.grabbedByPlayer && !box.inGrid) {
            count++;
        }
    }

    return count;
}

function createLanes(config: ConveyorBeltConfig): number[] {
    const laneCount = Math.max(1, Math.floor(config.width / 20));
    const spacing = config.width / (laneCount + 1);

    const lanes: number[] = [];

    for (let i = 1; i <= laneCount; i++) {
        lanes.push(
            config.centerY - config.width / 2 + spacing * i
        );
    }

    return lanes;
}