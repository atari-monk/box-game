export type TimerState = {
    running: boolean;
    finished: boolean;
    elapsed: number;
};

export function createTimer(): TimerState {
    return {
        running: false,
        finished: false,
        elapsed: 0
    };
}

export function startTimer(
    timer: TimerState
): void {
    if (timer.running || timer.finished) {
        return;
    }

    timer.running = true;
}

export function stopTimer(
    timer: TimerState
): void {
    if (!timer.running) {
        return;
    }

    timer.running = false;
    timer.finished = true;
}

export function resetTimer(
    timer: TimerState
): void {
    timer.running = false;
    timer.finished = false;
    timer.elapsed = 0;
}

export function updateTimer(
    timer: TimerState,
    dt: number
): void {
    if (!timer.running) {
        return;
    }

    timer.elapsed += dt;
}

export function getTimerSeconds(
    timer: TimerState
): number {
    return timer.elapsed;
}

export function formatTimer(
    timer: TimerState
): string {
    const totalMs = Math.floor(timer.elapsed * 1000);

    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const milliseconds = Math.floor((totalMs % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}.${milliseconds
            .toString()
            .padStart(2, "0")}`;
}

export function renderTimer(
    timer: TimerState,
    ctx: CanvasRenderingContext2D,
    x = 20,
    y = 40
): void {
    ctx.save();

    ctx.font = "32px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";

    ctx.fillText(formatTimer(timer), x, y);

    ctx.restore();
}