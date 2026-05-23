[en](../bootstrap.md)

## Zastartuj z lekkim silnikiem

Aby zainicjalizować grę w lekkim silniku, należy ją uruchomić i skonfigurować w głównym punkcie wejścia aplikacji.

### Gra

Gra jest proceduralna. Główna struktura to `GameState`.

`GameState` zawiera podstawowe komponenty silnika:

* `Renderer`
* `Input`
* `Audio`

Funkcja `createGame` inicjalizuje i zwraca instancję `GameState`.

Funkcja `updateGame` przyjmuje `GameState` oraz `dt` (delta czasu w sekundach).
Jest wywoływana w każdej klatce i odpowiada za aktualizację logiki gry.

Funkcja `renderGame` przyjmuje `GameState` oraz `alpha` (współczynnik interpolacji).
Czyści ekran przy użyciu renderera i rysuje aktualną klatkę.

Funkcja `startGameMusic` uruchamia muzykę w tle przy użyciu komponentu audio silnika.

```ts
// FILE: src/game.ts
import type { Renderer, Input, Audio } from "atari-monk-light-engine";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
};

export function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {
    return {
        renderer,
        input,
        audio
    };
}

export function updateGame(
    state: GameState,
    dt: number
) {
}

export function renderGame(
    state: GameState,
    alpha: number
) {
    state.renderer.clear();
}

export function startGameMusic(state: GameState) {
    state.audio.playMusic("bg", 0.5);
}
```

#### Wrapper OOP

Gra udostępnia również cienki wrapper OOP nad proceduralnym rdzeniem.

Implementuje on interfejs `IGame`, który jest standardowym API gry w silniku.
Ten wrapper jest warstwą wygody nad proceduralnym `GameState`.

```ts
export interface IGame {
    update(dt: number): void;
    render(alpha: number): void;
}
```

Wrapper enkapsuluje `GameState`, inicjalizuje grę i udostępnia publiczne metody:

* `update`
* `render`
* `startMusic`

```ts
// FILE: src/oop/game.ts
import { type IGame, Renderer, Input, Audio } from "atari-monk-light-engine";
import {
    type GameState,
    createGame,
    updateGame,
    renderGame,
    startGameMusic
} from "../game";

export class Game implements IGame {
    private state: GameState;

    constructor(
        renderer: Renderer,
        input: Input,
        audio: Audio
    ) {
        this.state = createGame(renderer, input, audio);
    }

    update(dt: number) {
        updateGame(this.state, dt);
    }

    render(alpha: number) {
        renderGame(this.state, alpha);
    }

    startMusic() {
        startGameMusic(this.state);
    }
}
```

## Main

Główny plik aplikacji odpowiada za inicjalizację silnika i uruchomienie gry.

Wykonuje następujące kroki:

1. Tworzy podstawowe komponenty silnika:

   * `Renderer`
   * `Input`
   * `Audio`

2. Ładuje wymagane zasoby audio do systemu audio.

3. Tworzy instancję wrappera gry (`Game`).

4. Obsługuje nakładkę interakcji użytkownika:

   * Nowoczesne przeglądarki wymagają gestu użytkownika do odtwarzania audio.
   * Kliknięcie w nakładkę ukrywa ekran startowy, pokazuje canvas i uruchamia muzykę za pomocą `playMusicAfterGesture`.

5. Inicjalizuje i uruchamia pętlę gry (`GameLoop`).

```ts
// FILE: src/main.ts
import "./styles.css";
import {
    Renderer,
    Input,
    Audio,
    GameLoop
} from "atari-monk-light-engine";
import { Game } from "./oop/game";

const renderer = new Renderer("canvas");
const input = new Input();

const audio = new Audio();

(async () => {
    await audio.load("move", "./sounds/move.wav");
    await audio.load("bg", "./sounds/bg.mp3");
})();

const game = new Game(renderer, input, audio);

const overlay = document.getElementById("start-overlay");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

overlay?.addEventListener("click", async () => {
    overlay.style.display = "none";
    canvas.style.display = "block";

    await audio.playMusicAfterGesture("bg", 0.5);
});

const loop = new GameLoop(
    (dt) => game.update(dt),
    (alpha) => game.render(alpha)
);

loop.start();
```

## Dźwięki

Folder `sounds` zawiera zasoby audio używane przez grę.

Komponent audio silnika obsługuje popularne formaty, takie jak `.wav` i `.mp3`.

Dźwięki są ładowane asynchronicznie przed odtworzeniem i są referencjonowane przez klucz tekstowy (np. `"bg"`, `"move"`).

---

## Notatki / wyjaśnienia

### Zachowanie pętli gry

Silnik `GameLoop` odpowiada za:

* Wywoływanie `update(dt)` z logiką stałego lub półstałego kroku czasu
* Wywoływanie `render(alpha)` dla interpolacji między klatkami

To rozdzielenie zapewnia płynne renderowanie nawet przy zmiennym czasie aktualizacji.

### Ograniczenia autoplay audio

Nowoczesne przeglądarki blokują odtwarzanie audio bez interakcji użytkownika.
Dlatego używane jest `playMusicAfterGesture` wewnątrz handlera kliknięcia nakładki.

### Separacja odpowiedzialności

* `GameState` → proceduralny kontener logiki
* Klasa `Game` → cienki adapter OOP dla kompatybilności z silnikiem
* `main.ts` → bootstrap, ładowanie zasobów i orkiestracja cyklu życia

### Odpowiedzialność renderera

Renderer odpowiada za czyszczenie i rysowanie klatek.
Logika rysowania wyższego poziomu powinna pozostać w `renderGame`, a nie w `main.ts`.