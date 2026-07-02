GameObject API

- Instead of GameObject use object name 

```ts
export type GameObjectState = {
    //props
};

export function createGameObject(
    //args
): GameObjectState {
    return {
        //initialization
    };
}

export function updateGameObject(
    obj: GameObjectState,
    dt: number
): void {
}

export function renderGameObject(
    obj: GameObjectState,
    ctx: CanvasRenderingContext2D
): void {
}
```