//todo: move to engine
export type SpriteAnimation = {
    row: number;
    frames: number;
    fps: number;
    loop?: boolean;
};

export type SpriteAnimatorState = {
    image: CanvasImageSource;
    frameWidth: number;
    frameHeight: number;

    animations: SpriteAnimation[];

    animation: number;
    frame: number;
    timer: number;
    finished: boolean;

    flipX: boolean;
    flipY: boolean;
};

export function createSpriteAnimator(
    image: CanvasImageSource,
    frameWidth: number,
    frameHeight: number,
    animations: SpriteAnimation[],
    animation = 0
): SpriteAnimatorState {
    return {
        image,
        frameWidth,
        frameHeight,
        animations,
        animation,
        frame: 0,
        timer: 0,
        finished: false,
        flipX: false,
        flipY: false
    };
}

export function setSpriteAnimation(
    state: SpriteAnimatorState,
    animation: number,
    restart = false
): void {
    if (!restart && state.animation === animation) {
        return;
    }

    state.animation = animation;
    state.frame = 0;
    state.timer = 0;
    state.finished = false;
}

export function updateSpriteAnimator(
    state: SpriteAnimatorState,
    dt: number
): void {
    const animation = state.animations[state.animation];

    if (state.finished || animation.frames <= 1 || animation.fps <= 0) {
        return;
    }

    state.timer += dt;

    const frameTime = 1 / animation.fps;

    while (state.timer >= frameTime) {
        state.timer -= frameTime;
        state.frame++;

        if (state.frame >= animation.frames) {
            if (animation.loop ?? true) {
                state.frame = 0;
            } else {
                state.frame = animation.frames - 1;
                state.finished = true;
                break;
            }
        }
    }
}

export function renderSpriteAnimator(
    state: SpriteAnimatorState,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width = state.frameWidth,
    height = state.frameHeight,
    rotation = 0
): void {
    const animation = state.animations[state.animation];

    const sx = state.frame * state.frameWidth;
    const sy = animation.row * state.frameHeight;

    ctx.save();
    ctx.translate(x + width * 0.5, y + height * 0.5);

    if (rotation !== 0) {
        ctx.rotate(rotation);
    }

    ctx.scale(state.flipX ? -1 : 1, state.flipY ? -1 : 1);

    ctx.drawImage(
        state.image,
        sx,
        sy,
        state.frameWidth,
        state.frameHeight,
        -width * 0.5,
        -height * 0.5,
        width,
        height
    );

    ctx.restore();
}