[en](../box.md)

# Dokumentacja modułu Box

Moduł `box.ts` bazuje na narzędziach prostokątów z `rect.ts` i dodaje proste zachowanie ruchu dla encji gry.

## Przeznaczenie

`Box` to:

* Renderowalny prostokąt
* Z prędkością ruchu
* Który automatycznie porusza się poziomo
* I może uczestniczyć w kolizjach

Jest używany głównie w demo jako poruszająca się przeszkoda.

---

# Stan Box

```ts
export type BoxState = RectState & {
    speed: number;
};
````

`BoxState` rozszerza `RectState` i dodaje:

| Właściwość | Typ      | Opis                     |
| ---------- | -------- | ------------------------ |
| `x`        | `number` | Pozycja pozioma          |
| `y`        | `number` | Pozycja pionowa          |
| `width`    | `number` | Szerokość boxa           |
| `height`   | `number` | Wysokość boxa            |
| `color`    | `string` | Kolor wypełnienia        |
| `speed`    | `number` | Prędkość ruchu poziomego |

Ponieważ rozszerza `RectState`, box może być używany wszędzie tam, gdzie wymagane jest renderowanie lub kolizje prostokątów.

---

# createBox

Tworzy poruszający się kwadratowy box.

```ts
createBox(
    x: number,
    y: number,
    size = 20,
    speed = 80
): BoxState
```

## Parametry

| Parametr | Opis                          |
| -------- | ----------------------------- |
| `x`      | Początkowa pozycja pozioma    |
| `y`      | Początkowa pozycja pionowa    |
| `size`   | Szerokość i wysokość kwadratu |
| `speed`  | Prędkość ruchu poziomego      |

## Przykład

```ts
const box = createBox(650, 200);
```

## Domyślny wygląd

Boxy są tworzone z kolorem:

```ts
"rgba(255,0,0,.5)"
```

Tworzy to półprzezroczysty czerwony kwadrat.

---

# updateBox

Aktualizuje ruch poziomy.

```ts
updateBox(
    box: BoxState,
    dt: number,
    startX: number,
    endX: number
)
```

## Zachowanie

W każdej klatce:

```ts
box.x += box.speed * dt;
```

Box porusza się w prawo z użyciem delta time.

Gdy box przekroczy `endX`:

```ts
if (box.x > endX) {
    box.x = startX;
}
```

wraca z powrotem do `startX`.

Tworzy to ciągły zapętlony ruch.

## Przykład

```ts
updateBox(box, dt, 650, 950);
```

---

# renderBox

Renderuje box na canvasie.

```ts
renderBox(
    box: BoxState,
    ctx: CanvasRenderingContext2D
)
```

Wewnętrznie deleguje renderowanie do `renderRect`.

## Przykład

```ts
renderBox(box, ctx);
```

---

# Integracja z demo/grą

Klasa `BoxDemo` pokazuje, jak boxy integrują się z silnikiem, ruchem gracza, renderowaniem, audio i systemami kolizji.

---

# Struktura stanu gry

```ts
type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
    boxes: BoxState[];
    colliders: RectState[];
};
```

## Ważne zależności

### `boxes`

Przechowuje aktywne poruszające się boxy:

```ts
boxes: BoxState[];
```

### `colliders`

Przechowuje prostokąty kolizji używane przez system kolizji:

```ts
colliders: RectState[];
```

Boxy są dodawane do listy colliderów:

```ts
colliders: [
    ...boxes
]
```

Ponieważ `BoxState` rozszerza `RectState`, boxy mogą być traktowane jako generyczne prostokąty kolizji.

---

# Tworzenie gry

Boxy są tworzone podczas inicjalizacji:

```ts
const boxes = [
    createBox(650, 200),
    createBox(650, 230),
    createBox(650, 260),
    createBox(650, 290)
];
```

Tworzy to pionowy rząd poruszających się przeszkód.

Gracz również jest inicjalizowany:

```ts
player: new Player(960 - 25, 350, 200, 50)
```

---

# Przepływ aktualizacji

W każdej klatce:

## 1. Aktualizacja gracza

```ts
const moved = state.player.update(dt, state.input);
```

Gracz przetwarza wejście i ruch.

---

## 2. Uruchomienie audio

```ts
if (moved) {
    state.audio.play("move");
}
```

Dźwięk ruchu jest odtwarzany tylko wtedy, gdy gracz się porusza.

---

## 3. Aktualizacja boxów

```ts
for (const box of state.boxes) {
    updateBox(box, dt, 650, 650 + 300);
}
```

Każdy box porusza się poziomo i wraca na początek po przekroczeniu granicy.

Zakres ruchu:

* Początek: `650`
* Koniec: `950`

---

## 4. Rozwiązywanie kolizji

```ts
resolvePlayerRectCollisions(
    state.player.state,
    state.colliders
);
```

Prostokąt gracza jest sprawdzany względem wszystkich prostokątów kolizji.

Ponieważ boxy są zawarte w `colliders`, gracz automatycznie koliduje z poruszającymi się boxami.

---

# Przepływ renderowania

Renderowanie odbywa się w następującej kolejności:

## 1. Czyszczenie ekranu

```ts
state.renderer.clear();
```

---

## 2. Renderowanie boxów

```ts
for (const box of state.boxes) {
    renderBox(box, state.renderer.ctx);
}
```

Wszystkie poruszające się przeszkody są rysowane.

---

## 3. Renderowanie gracza

```ts
state.player.render(ctx, alpha);
```

Gracz jest renderowany po boxach.

---

# Uwagi projektowe

Ta architektura demonstruje kilka wzorców wielokrotnego użytku:

## Kompozycja zamiast duplikacji

`BoxState` rozszerza `RectState` zamiast ponownie definiować właściwości prostokąta.

---

## Współdzielone typy kolizji

Każdy obiekt zgodny z `RectState` może uczestniczyć w wykrywaniu kolizji.

---

## Rozdzielone renderowanie

`renderBox` deleguje renderowanie do `renderRect`.

Dzięki temu logika renderowania pozostaje scentralizowana.

---

## Bezstanowe funkcje aktualizacji

`updateBox` jedynie modyfikuje przekazany obiekt stanu i całkowicie zależy od parametrów:

```ts
updateBox(box, dt, startX, endX)
```

Dzięki temu zachowanie jest przewidywalne i wielokrotnego użytku.

---

# Podsumowanie

System boxów zapewnia:

* Encje wielokrotnego użytku oparte na prostokątach
* Automatyczny ruch poziomy
* Zapętlone zachowanie przeszkód
* Współdzieloną kompatybilność kolizji
* Prostą integrację renderowania

Demo pokazuje, jak boxy mogą być integrowane z:

* Zarządzaniem stanem gry
* Pętlami aktualizacji
* Pipeline’ami renderowania
* Systemami kolizji
* Logiką rozgrywki wyzwalaną przez audio