import { createGrid, type Grid, updateGrid, renderGrid } from "./box-gird";
import type { BoxState } from "./box";
import { createPoint, renderPoint, type PointState } from "./draw-point";

export type GridCluster = {
    centerX: number;
    centerY: number;
    spacingX: number;
    spacingY: number;
    grids: Grid[];
    point: PointState;
    pointEnabled: boolean;
};

export function createGridCluster(
    centerX: number,
    centerY: number,
    cellSize: number,
    cols: number,
    rows: number,
    spacingX: number,
    spacingY: number
): GridCluster {
    const width = cols * cellSize;
    const height = rows * cellSize;

    const halfW = width + spacingX / 2;
    const halfH = height + spacingY / 2;

    const grids = [
        createGrid(centerX - halfW, centerY - halfH, cellSize, cols, rows, "red"),
        createGrid(centerX + spacingX / 2, centerY - halfH, cellSize, cols, rows, "green"),
        createGrid(centerX - halfW, centerY + spacingY / 2, cellSize, cols, rows, "yellow"),
        createGrid(centerX + spacingX / 2, centerY + spacingY / 2, cellSize, cols, rows, "purple")
    ];

    const point = createPoint(centerX, centerY);

    return {
        centerX,
        centerY,
        spacingX,
        spacingY,
        grids,
        point,
        pointEnabled: false
    };
}

export function setClusterCenter(
    cluster: GridCluster,
    centerX: number,
    centerY: number
) {
    const g = cluster.grids[0];
    const width = g.cols * g.cellSize;
    const height = g.rows * g.cellSize;

    const halfW = width + cluster.spacingX / 2;
    const halfH = height + cluster.spacingY / 2;

    cluster.centerX = centerX;
    cluster.centerY = centerY;

    cluster.grids[0].x = centerX - halfW;
    cluster.grids[0].y = centerY - halfH;

    cluster.grids[1].x = centerX + cluster.spacingX / 2;
    cluster.grids[1].y = centerY - halfH;

    cluster.grids[2].x = centerX - halfW;
    cluster.grids[2].y = centerY + cluster.spacingY / 2;

    cluster.grids[3].x = centerX + cluster.spacingX / 2;
    cluster.grids[3].y = centerY + cluster.spacingY / 2;

    const size = cluster.point.horizontal.width;
    const thickness = cluster.point.horizontal.height;

    cluster.point = createPoint(centerX, centerY, size, thickness);
}

export function updateGridCluster(
    cluster: GridCluster,
    boxes: BoxState[]
) {
    for (const grid of cluster.grids) {
        updateGrid(grid, boxes);
    }
}

export function renderGridCluster(
    cluster: GridCluster,
    ctx: CanvasRenderingContext2D
) {
    for (const grid of cluster.grids) {
        renderGrid(grid, ctx);
    }

    if (cluster.pointEnabled) {
        renderPoint(cluster.point, ctx);
    }
}

export function toggleClusterPoint(
    cluster: GridCluster
) {
    cluster.pointEnabled = !cluster.pointEnabled;
}