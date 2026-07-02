export type HighScoreState = {
    scores: number[];
    storageKey: string;
};

export function createHighScore(
    storageKey = "high-scores"
): HighScoreState {
    const state: HighScoreState = {
        scores: [],
        storageKey
    };

    loadHighScores(state);

    return state;
}

export function loadHighScores(
    state: HighScoreState
): void {
    try {
        const value = localStorage.getItem(state.storageKey);

        if (!value) {
            state.scores = [];
            return;
        }

        const scores = JSON.parse(value);

        if (!Array.isArray(scores)) {
            state.scores = [];
            return;
        }

        state.scores = scores
            .filter((score): score is number => typeof score === "number")
            .sort((a, b) => a - b)
            .slice(0, 10);
    } catch {
        state.scores = [];
    }
}

export function saveHighScores(
    state: HighScoreState
): void {
    localStorage.setItem(
        state.storageKey,
        JSON.stringify(state.scores)
    );
}

export function addHighScore(
    state: HighScoreState,
    score: number
): void {
    state.scores.push(score);
    state.scores.sort((a, b) => a - b);

    if (state.scores.length > 10) {
        state.scores.length = 10;
    }

    saveHighScores(state);
}

export function renderHighScores(
    state: HighScoreState,
    ctx: CanvasRenderingContext2D,
    x = 20,
    y = 80
): void {
    ctx.save();

    ctx.font = "20px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";

    ctx.fillText("High Scores", x, y);

    for (let i = 0; i < state.scores.length; i++) {
        const score = state.scores[i];

        const minutes = Math.floor(score / 60);
        const seconds = Math.floor(score % 60);
        const milliseconds = Math.floor((score % 1) * 100);

        const text =
            `${i + 1}. ` +
            `${minutes.toString().padStart(2, "0")}:` +
            `${seconds.toString().padStart(2, "0")}.` +
            `${milliseconds.toString().padStart(2, "0")}`;

        ctx.fillText(text, x, y + 30 + i * 24);
    }

    ctx.restore();
}

export function resetHighScores(state: HighScoreState): void {
    state.scores = [];
    saveHighScores(state);
}