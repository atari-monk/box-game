- Debug view with points to mesure stuff
- Stored in md in case of need

`test-view.ts`:

```ts
import { createPoint, renderPoint, type PointState } from "./draw-point";

export type TestViewState = {
    enabled: boolean;
    point: PointState;
};

export function createTestView(
    screenWidth: number,
    screenHeight: number
): TestViewState {
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    return {
        enabled: false,
        point: createPoint(centerX, centerY)
    };
}

export function renderTestView(
    state: TestViewState,
    ctx: CanvasRenderingContext2D
) {
    if (!state.enabled) return;

    renderPoint(state.point, ctx);
}

export function toggleTestView(state: TestViewState) {
    state.enabled = !state.enabled;
}
```

`game.ts`:

```ts
//GameState
testView: TestViewState;

//createGame
const testView = createTestView(1920, 1080);

//updateGame
 if (state.input.isPressed("p")) {
        state.testView.enabled = !state.testView.enabled;

//renderGame
renderTestView(state.testView, ctx);
```