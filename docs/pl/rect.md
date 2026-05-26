[en](../rect.md)

## Dokumentacja modułu Rect (`src/rect.ts`)

Moduł `rect` definiuje prosty, niezależny od frameworka prymityw prostokąta, oparty na zwykłej strukturze danych (`RectState`) oraz dwóch funkcjach narzędziowych do tworzenia i renderowania.

### `RectState`

```ts
export type RectState = {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
};
```

Reprezentuje prostokąt w przestrzeni 2D:

* `x`, `y` — pozycja lewego górnego rogu na canvasie
* `width`, `height` — rozmiar prostokąta
* `color` — kolor wypełnienia używany podczas renderowania

Jest to **czysty model danych** bez logiki.

---

### `createRect(...)`

```ts
export function createRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color = "white"
): RectState
```

Funkcja fabrykująca tworząca `RectState`.

* Zapewnia domyślny kolor (`white`)
* Utrzymuje spójny i scentralizowany sposób tworzenia obiektów
* Przydatna do zapewnienia, że wszystkie prostokąty mają ten sam kontrakt struktury

---

### `renderRect(rect, ctx)`

```ts
export function renderRect(
    rect: RectState,
    ctx: CanvasRenderingContext2D
)
```

Renderuje prostokąt na canvasie.

* Używa `ctx.fillStyle` do ustawienia koloru
* Rysuje poprzez `ctx.fillRect(x, y, width, height)`
* Brak efektów ubocznych poza rysowaniem
* Logika wyłącznie warstwy prezentacji

To rozdzielenie sprawia, że prostokąty mogą być używane w różnych architekturach (funkcyjnej, ECS, wrapperze OOP).

---

## Wrapper OOP (`src/oop/rect.ts`)

Klasa `Rect` jest cienkim obiektem OOP opakowującym funkcyjny `RectState`.

### Cel

* Opakowanie stanu (`RectState`) w klasę
* Udostępnienie kontrolowanego dostępu przez getter `state`
* Ponowne wykorzystanie logiki funkcyjnej (`createRect`, `renderRect`) zamiast jej duplikowania

### Kluczowa idea

To **nie jest pełne przepisanie na OOP**, lecz lekka warstwa adaptera:

* Stan jest (prawie) niemutowalny (prywatny)
* Tworzenie delegowane do `createRect`
* Renderowanie delegowane do `renderRect`

### Struktura

```ts
class Rect {
    private _state: RectState;

    get state()
```

* `_state` przechowuje rzeczywiste dane prostokąta
* `state` udostępnia dostęp tylko do odczytu (brak API mutacji w obecnym projekcie)

### Zachowanie

```ts
render(ctx: CanvasRenderingContext2D)
```

* Wywołuje współdzielone `renderRect`
* Zapewnia spójność między użyciem funkcyjnym i OOP

### Podsumowanie

Ten wrapper istnieje głównie dla **integracji z obiektową architekturą gry**, a nie po to, by wprowadzać złożoną enkapsulację.

---

## Rig do developmentu gry (`src/game-dev.ts`)

Moduł `GameDev` to lekkie środowisko testowe do integracji nowych encji i weryfikacji systemów gameplayowych.

### Cel

Służy jako **sandboxowy kontener stanu gry**, łączący:

* Systemy silnika (`Renderer`, `Input`, `Audio`)
* Encje gameplayowe (`Player`, `Rect`)
* Orkiestrację update/render

---

### Skład GameState

```ts
export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
    rect_a: Rect;
    rect_b: Rect;
};
```

Taka konfiguracja pozwala na szybkie testowanie:

* ruchu gracza i interakcji
* renderowania wielu typów encji
* wyzwalania audio z eventów gameplayowych
* warstwowania i kolejności rysowania na canvasie

---

### Inicjalizacja (`createGame`)

```ts
rect_a: new Rect(400, 200, 120, 80, "blue"),
rect_b: new Rect(540, 200, 120, 80, "blue")
```

Dwa prostokąty są tworzone jako statyczne encje testowe:

* używane jako **wizualne punkty odniesienia**
* przydatne do testowania kolizji, wyrównania i kolejności renderowania
* pomagają w weryfikacji skalowania systemu encji poza graczem

---

### Pętla update (`updateGame`)

```ts
const moved = state.player.update(dt, state.input);

if (moved) {
    state.audio.play("move");
}
```

Odpowiedzialności:

* aktualizacja gracza na podstawie inputu
* wykrywanie ruchu
* wyzwalanie dźwięku przy ruchu

Dzięki temu jest to dobry minimalny test:

* pipeline input → stan → reakcja
* poprawności triggerów audio
* logiki ruchu opartej o delta time

---

### Pętla render (`renderGame`)

```ts
state.renderer.clear();

state.rect_a.render(state.renderer.ctx);
state.player.render(state.renderer.ctx, alpha);
state.rect_b.render(state.renderer.ctx);
```

Kolejność renderowania:

1. Wyczyść ekran
2. Narysuj statyczne prostokąty (tło / obiekty testowe)
3. Narysuj gracza (warstwa pośrednia z interpolacją `alpha`)
4. Narysuj drugi prostokąt (obiekt testowy na pierwszym planie)

To proste, ale użyteczne ustawienie do:

* weryfikacji kolejności warstw (z-order)
* testowania interpolacji (`alpha`)
* sprawdzania kompozycji wielu encji

---

## Przełącznik Game vs GameDev (`src/main.ts`)

### Aktualna struktura

```ts
const game = new GameDev(renderer, input, audio);
```

Aplikacja obecnie używa **GameDev jako aktywnego runtime gry**.

---

### Rola przełącznika

Istnieje tutaj architektoniczny podział:

* `Game` → produkcyjna lub „finalna” implementacja gry
* `GameDev` → środowisko eksperymentalne / testowe integracji

---

### Dlaczego to istnieje

Ten wzorzec pozwala na:

* szybkie prototypowanie nowych encji (np. `Rect`, `Player`)
* bezpieczne testowanie bez ryzyka uszkodzenia głównej logiki
* porównywanie wersji eksperymentalnej i stabilnej

---

### W `main.ts`

Pętla gry jest odseparowana:

```ts
(dt) => game.update(dt),
(alpha) => game.render(alpha)
```

Dzięki temu podmiana implementacji jest trywialna:

```ts
const game = new Game(renderer, input, audio);
```

lub

```ts
const game = new GameDev(renderer, input, audio);
```

---

### Podsumowanie

* `GameDev` to **sandbox integracyjny**
* `Game` to **docelowa wersja runtime**
* `main.ts` działa jako **przełącznik dla środowiska wykonania**

Taki design wspiera iteracyjny rozwój bez sprzęgania eksperymentów z logiką produkcyjną.