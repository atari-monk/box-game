import type { BoxColor, BoxState } from "./box";

export type Grid = {
    x: number;
    y: number;
    cellSize: number;
    cols: number;
    rows: number;
    cells: (BoxState | null)[][];
    color: BoxColor;
};

export function createGrid(
    x: number,
    y: number,
    cellSize: number,
    cols: number,
    rows: number,
    color: BoxColor
): Grid {
    const cells = Array.from({ length: rows }, () => Array(cols).fill(null));
    return { x, y, cellSize, cols, rows, cells, color };
}

export function snapBoxToGrid(box: BoxState, grid: Grid) {
    if (box.inGrid) return;
    if (box.color !== grid.color) return;

    const col = Math.floor((box.x - grid.x) / grid.cellSize);
    const row = Math.floor((box.y - grid.y) / grid.cellSize);

    if (
        col >= 0 && col < grid.cols &&
        row >= 0 && row < grid.rows &&
        !grid.cells[row][col]
    ) {
        grid.cells[row][col] = box;
        box.x = grid.x + col * grid.cellSize;
        box.y = grid.y + row * grid.cellSize;
        box.grabbedByPlayer = false;
        box.inGrid = true;
    }
}

export function updateGrid(grid: Grid, boxes: BoxState[]) {
    for (const box of boxes) {
        if (box.inGrid) continue;
        if (!box.grabbedByPlayer) {
            snapBoxToGrid(box, grid);
        }
    }
}

export function renderGrid(grid: Grid, ctx: CanvasRenderingContext2D) {
    const strokeMap = {
        red: "rgba(255,0,0,0.6)",
        green: "rgba(0,255,0,0.6)",
        yellow: "rgba(255,255,0,0.6)",
        purple: "rgba(128,0,128,0.6)"
    };

    const fillMap = {
        red: "rgba(255,0,0,0.08)",
        green: "rgba(0,255,0,0.08)",
        yellow: "rgba(255,255,0,0.08)",
        purple: "rgba(128,0,128,0.08)"
    };

    ctx.strokeStyle = strokeMap[grid.color];
    ctx.fillStyle = fillMap[grid.color];

    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const x = grid.x + col * grid.cellSize;
            const y = grid.y + row * grid.cellSize;

            ctx.fillRect(x, y, grid.cellSize, grid.cellSize);
            ctx.strokeRect(x, y, grid.cellSize, grid.cellSize);
        }
    }
}

export function fillGridFromFactory(
    grid: Grid,
    boxes: BoxState[]
) {
    let boxIndex = 0;

    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            if (grid.cells[row][col]) continue;

            while (boxIndex < boxes.length) {
                const box = boxes[boxIndex++];
                if (box.inGrid) continue;
                if (box.color !== grid.color) continue;

                grid.cells[row][col] = box;

                box.x = grid.x + col * grid.cellSize;
                box.y = grid.y + row * grid.cellSize;
                box.inGrid = true;
                box.grabbedByPlayer = false;
                box.speed = 0;

                break;
            }
        }
    }
}

export function fillGrids(grids: Grid[], boxes: BoxState[]) {
    for (const grid of grids) {
        fillGridFromFactory(grid, boxes);
    }
}