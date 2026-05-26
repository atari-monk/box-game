import { type PlayerState } from "./player";
import { type RectState } from "./rect";

function intersects(
    px: number,
    py: number,
    size: number,
    rect: RectState
) {
    return (
        px < rect.x + rect.width &&
        px + size > rect.x &&
        py < rect.y + rect.height &&
        py + size > rect.y
    );
}

export function resolvePlayerRectCollisions(
    player: PlayerState,
    rects: RectState[]
) {
    const size = player.size;

    const dx = player.x - player.prevX;
    const dy = player.y - player.prevY;

    player.x = player.prevX;
    player.y = player.prevY;

    player.x += dx;

    for (const rect of rects) {
        if (!intersects(player.x, player.y, size, rect)) continue;

        if (dx > 0) {
            player.x = rect.x - size;
        } else if (dx < 0) {
            player.x = rect.x + rect.width;
        }
    }

    player.y += dy;

    for (const rect of rects) {
        if (!intersects(player.x, player.y, size, rect)) continue;

        if (dy > 0) {
            player.y = rect.y - size;
        } else if (dy < 0) {
            player.y = rect.y + rect.height;
        }
    }
}