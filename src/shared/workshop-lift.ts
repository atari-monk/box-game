import type { PlayerState } from "./player";
import type { Grid } from "./box-gird";
import {
    type RectState,
    createRect,
    renderRect
} from "./rect";

export type LiftState = RectState & {
    controlled: boolean;
    attachedToPlayer: boolean;
    originalSize: { width: number; height: number };
    rotation: number;
    carriedGrid?: Grid;
};

export function createLift(
    x: number,
    y: number,
    playerSize: number
): LiftState {
    const width = playerSize / 3;
    const height = playerSize;

    return {
        ...createRect(
            x,
            y,
            width,
            height,
            "rgba(255,165,0,0.8)"
        ),
        controlled: false,
        attachedToPlayer: false,
        originalSize: { width, height },
        rotation: 0
    };
}

function updateLiftOrientation(
    lift: LiftState,
    player: PlayerState
) {
    const absDirX = Math.abs(player.dirX);
    const absDirY = Math.abs(player.dirY);
    const isHorizontal = absDirX > absDirY;
    const isVertical = absDirY > absDirX;

    if (isHorizontal) {
        lift.width = lift.originalSize.height;
        lift.height = lift.originalSize.width;
        lift.rotation = 0;
    } else if (isVertical) {
        lift.width = lift.originalSize.width;
        lift.height = lift.originalSize.height;
        lift.rotation = 0;
    } else {
        lift.width = lift.originalSize.height;
        lift.height = lift.originalSize.width;

        if (player.dirX > 0 && player.dirY > 0) lift.rotation = 45;
        else if (player.dirX > 0 && player.dirY < 0) lift.rotation = -45;
        else if (player.dirX < 0 && player.dirY > 0) lift.rotation = 135;
        else lift.rotation = -135;
    }
}

function getFrontPosition(
    player: PlayerState,
    liftWidth: number,
    liftHeight: number
) {
    const centerX = player.x + player.size / 2;
    const centerY = player.y + player.size / 2;

    return {
        x: centerX + player.dirX * player.size - liftWidth / 2,
        y: centerY + player.dirY * player.size - liftHeight / 2
    };
}

function isGridFull(grid: Grid) {
    for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
            if (!grid.cells[r][c]) return false;
        }
    }
    return true;
}

function isLiftOverGrid(lift: LiftState, grid: Grid) {
    const w = grid.cols * grid.cellSize;
    const h = grid.rows * grid.cellSize;

    return !(
        lift.x + lift.width < grid.x ||
        lift.x > grid.x + w ||
        lift.y + lift.height < grid.y ||
        lift.y > grid.y + h
    );
}

function getLiftFront(lift: LiftState, player: PlayerState) {
    return {
        x: lift.x + lift.width / 2 + player.dirX * lift.width,
        y: lift.y + lift.height / 2 + player.dirY * lift.height
    };
}

function snapGridToLift(
    lift: LiftState,
    grid: Grid,
    player: PlayerState
) {
    const front = getLiftFront(lift, player);

    const w = grid.cols * grid.cellSize;
    const h = grid.rows * grid.cellSize;

    grid.x = front.x - w / 2;
    grid.y = front.y - h / 2;

    moveGridBoxes(grid);
}

export function updateLift(
    lift: LiftState,
    player: PlayerState,
    input: { isPressed: (key: string) => boolean },
    grids: Grid[]
) {
    if (input.isPressed("e")) {
        if (lift.carriedGrid) {
            lift.carriedGrid = undefined;
            return;
        }

        for (const grid of grids) {
            if ((grid as any).locked) continue;
            if (!isGridFull(grid)) continue;
            if (!isLiftOverGrid(lift, grid)) continue;

            lift.carriedGrid = grid;
            lift.controlled = true;
            lift.attachedToPlayer = true;

            updateLiftOrientation(lift, player);

            const front = getFrontPosition(player, lift.width, lift.height);
            lift.x = front.x;
            lift.y = front.y;

            snapGridToLift(lift, grid, player);
            return;
        }

        const px = player.x + player.size / 2;
        const py = player.y + player.size / 2;
        const lx = lift.x + lift.width / 2;
        const ly = lift.y + lift.height / 2;

        const dist = Math.hypot(px - lx, py - ly);

        if (!lift.controlled && dist < player.size) {
            lift.controlled = true;
            lift.attachedToPlayer = true;
        } else {
            lift.controlled = false;
            lift.attachedToPlayer = false;
        }
    }

    if (lift.controlled && lift.attachedToPlayer) {
        updateLiftOrientation(lift, player);

        const front = getFrontPosition(player, lift.width, lift.height);
        lift.x = front.x;
        lift.y = front.y;

        if (lift.carriedGrid) {
            snapGridToLift(lift, lift.carriedGrid, player);
        }
    }
}

export function renderLift(
    lift: LiftState,
    ctx: CanvasRenderingContext2D
) {
    if (lift.rotation !== 0) {
        ctx.save();
        ctx.translate(
            lift.x + lift.width / 2,
            lift.y + lift.height / 2
        );
        ctx.rotate(lift.rotation * Math.PI / 180);

        ctx.fillStyle = lift.color;
        ctx.fillRect(
            -lift.width / 2,
            -lift.height / 2,
            lift.width,
            lift.height
        );

        if (lift.controlled) {
            ctx.strokeStyle = "rgba(255,200,0,0.9)";
            ctx.lineWidth = 2;
            ctx.strokeRect(
                -lift.width / 2,
                -lift.height / 2,
                lift.width,
                lift.height
            );
        }

        ctx.restore();
    } else {
        renderRect(lift, ctx);

        if (lift.controlled) {
            ctx.save();
            ctx.strokeStyle = "rgba(255,200,0,0.9)";
            ctx.lineWidth = 2;
            ctx.strokeRect(
                lift.x,
                lift.y,
                lift.width,
                lift.height
            );
            ctx.restore();
        }
    }
}

function moveGridBoxes(grid: Grid) {
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const box = grid.cells[row][col];
            if (!box) continue;

            box.x = grid.x + col * grid.cellSize;
            box.y = grid.y + row * grid.cellSize;
        }
    }
}