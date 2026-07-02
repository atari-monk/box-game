import type { Grid } from "./box-gird";
import {
    createRect,
    renderRect,
    type RectState
} from "./rect";

export type ZoneState = RectState & {
    active: boolean;
    prevCarried: Set<any>;
    tag?: string;
};

export function createZone(
    x: number,
    y: number,
    width: number,
    height: number
): ZoneState {
    return {
        ...createRect(
            x,
            y,
            width,
            height,
            "rgba(255,255,255,0.1)"
        ),
        active: false,
        prevCarried: new Set()
    };
}

function overlaps(
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    bx: number,
    by: number,
    bw: number,
    bh: number
) {
    return !(
        ax + aw < bx ||
        ax > bx + bw ||
        ay + ah < by ||
        ay > by + bh
    );
}

export function updateZone(
    zone: ZoneState,
    items: any[],
    carriedItem?: any,
    getBounds?: (item: any) => { x: number; y: number; width: number; height: number },
    canAccept?: (item: any, zone: ZoneState) => boolean
) {
    if (carriedItem) {
        zone.prevCarried.add(carriedItem);
    }

    for (const item of items) {
        if ((item as any).locked) continue;

        if (canAccept && !canAccept(item, zone)) continue;

        const wasCarried = zone.prevCarried.has(item);
        const nowFree = carriedItem !== item;

        const bounds = getBounds
            ? getBounds(item)
            : item;

        if (
            wasCarried &&
            nowFree &&
            overlaps(
                zone.x,
                zone.y,
                zone.width,
                zone.height,
                bounds.x,
                bounds.y,
                bounds.width,
                bounds.height
            )
        ) {
            (item as any).locked = true;
            zone.active = true;
        }
    }

    if (!carriedItem) {
        zone.prevCarried.clear();
    }

    const base = (zone as any).baseColor;
    const active = (zone as any).activeColor;

    if (base && active) {
        zone.color = zone.active ? active : base;
    }
}

export function renderZone(
    zone: ZoneState,
    ctx: CanvasRenderingContext2D
) {
    renderRect(zone, ctx);
}

export function createZonesRow(
    centerX: number,
    y: number,
    size: number,
    gap: number
): ZoneState[] {
    const colors = ["red", "green", "yellow", "purple"];

    const baseColors: any = {
        red: "rgba(255,0,0,0.15)",
        green: "rgba(0,255,0,0.15)",
        yellow: "rgba(255,255,0,0.15)",
        purple: "rgba(128,0,128,0.15)"
    };

    const activeColors: any = {
        red: "rgba(255,0,0,0.35)",
        green: "rgba(0,255,0,0.35)",
        yellow: "rgba(255,255,0,0.35)",
        purple: "rgba(128,0,128,0.35)"
    };

    const zones: ZoneState[] = [];

    const totalWidth =
        colors.length * size +
        (colors.length - 1) * gap;

    const startX = centerX - totalWidth / 2;

    for (let i = 0; i < colors.length; i++) {
        const x =
            startX +
            i * (size + gap);

        const zone = createZone(
            Math.round(x),
            y,
            size,
            size
        );

        const color = colors[i];

        zone.tag = color;

        (zone as any).baseColor = baseColors[color];
        (zone as any).activeColor = activeColors[color];

        zones.push(zone);
    }

    return zones;
}

export function updateZones(zones: ZoneState[], grids: Grid[], carriedGrid?: Grid) {
    for (const zone of zones) {
        updateZone(
            zone,
            grids,
            carriedGrid,
            (grid) => ({
                x: grid.x,
                y: grid.y,
                width: grid.cols * grid.cellSize,
                height: grid.rows * grid.cellSize
            }),
            (grid, zone) => grid.color === zone.tag
        );
    }
}

export function renderZones(zones: ZoneState[], ctx: CanvasRenderingContext2D) {
    for (const zone of zones) {
        renderZone(zone, ctx);
    }
}