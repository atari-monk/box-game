[en](../box-grab.md)

# System Chwytania Skrzynek

System chwytania skrzynek pozwala graczowi podnosić, przenosić i odkładać poruszające się skrzynki na taśmie transportowej za pomocą klawiatury. Rozszerza bazowe zachowanie skrzynek o stan interakcji gracza i integruje się bezpośrednio z pętlą rozgrywki demo.

---

# Przegląd

Funkcjonalność została zaimplementowana w `src/box.ts` poprzez:

* dodatkowy stan skrzynki związany z chwytaniem
* wykrywanie bliskości gracza
* logikę przyczepiania
* obsługę puszczania
* nadpisanie ruchu podczas przenoszenia

Integracja demo znajduje się w:

* `src/demo/box-grab.ts`

gdzie połączone są gracz, taśma transportowa i fabryka skrzynek.

---

# Stan Skrzynki

`BoxState` rozszerza `RectState` o właściwości specyficzne dla rozgrywki.

```ts
export type BoxState = RectState & {
    speed: number;
    grabbedByPlayer: boolean;
    inGrid: boolean;
    color: BoxColor;
    offsetX?: number;
    offsetY?: number;
};
```

## Właściwości

| Właściwość        | Opis                                                     |
| ----------------- | -------------------------------------------------------- |
| `speed`           | Pozioma prędkość ruchu na taśmie transportowej           |
| `grabbedByPlayer` | Określa, czy gracz niesie skrzynkę                       |
| `inGrid`          | Zapobiega chwytaniu skrzynek umieszczonych w siatce      |
| `color`           | Wariant koloru skrzynki                                  |
| `offsetX`         | Względne przesunięcie X względem gracza podczas noszenia |
| `offsetY`         | Względne przesunięcie Y względem gracza podczas noszenia |

Dziedziczony `RectState` zapewnia:

```ts
x
y
width
height
color
```

z `src/rect.ts`.

---

# Tworzenie Skrzynek

Skrzynki są tworzone za pomocą `createBox()`.

```ts
createBox(
    x,
    y,
    color,
    size = 20,
    speed = 80
)
```

Przykład:

```ts
const box = createBox(100, 50, "red");
```

## Wewnętrzna Inicjalizacja

Każda skrzynka:

* używa `createRect()` do utworzenia bazowych danych prostokąta
* otrzymuje półprzezroczysty kolor
* zaczyna jako niechwycona
* zaczyna poza siatką

```ts
grabbedByPlayer: false,
inGrid: false
```

---

# Ruch Skrzynki

Ruch jest obsługiwany przez `updateBox()`.

```ts
updateBox(
    box,
    dt,
    startX,
    endX,
    player
)
```

Funkcja obsługuje dwa tryby ruchu:

---

## Ruch na Taśmie Transportowej

Gdy skrzynka nie jest chwycona:

```ts
box.x += box.speed * dt;
```

Jeśli skrzynka opuści granicę taśmy:

```ts
if (box.x > endX) {
    box.x = startX;
}
```

Tworzy to efekt zapętlonej taśmy transportowej.

---

## Ruch Podczas Noszenia przez Gracza

Gdy skrzynka jest chwycona:

```ts
if (box.grabbedByPlayer && player) {
    box.x = player.x + (box.offsetX ?? 0);
    box.y = player.y + (box.offsetY ?? 0);
    return;
}
```

Skrzynka przestaje korzystać z ruchu taśmy i zamiast tego podąża za pozycją gracza.

Zapisane przesunięcia zachowują oryginalną pozycję chwytu względem gracza.

---

# Logika Chwytania

Interakcja gracza jest zaimplementowana poprzez:

```ts
handleBoxGrab(
    boxes,
    player,
    input
)
```

Interakcja wykorzystuje klawisz `E`:

```ts
if (!input.isPressed("e")) return;
```

---

# Chwytanie Skrzynki

System przechodzi przez wszystkie dostępne skrzynki.

Skrzynki już umieszczone w siatce są ignorowane:

```ts
if (box.inGrid) continue;
```

Odległość jest mierzona między środkiem skrzynki a środkiem gracza.

```ts
const dx = playerCenterX - boxCenterX;
const dy = playerCenterY - boxCenterY;
```

Chwyt następuje, gdy:

```ts
Math.hypot(dx, dy) < grabRange
```

przy:

```ts
const grabRange = 80;
```

---

## Zmiany Stanu po Chwyceniu

Po chwyceniu:

```ts
box.grabbedByPlayer = true;
```

Zapisywane jest względne przesunięcie podczas noszenia:

```ts
box.offsetX = box.x - player.x;
box.offsetY = box.y - player.y;
```

Ruch taśmy transportowej zostaje wyłączony:

```ts
box.speed = 0;
```

---

# Puszczanie Skrzynki

Jeśli gracz naciśnie `E`, mając już skrzynkę:

```ts
if (box.grabbedByPlayer) {
    box.grabbedByPlayer = false;
    break;
}
```

Skrzynka zostaje odłączona od gracza.

Obecna implementacja nie przywraca automatycznie prędkości taśmy po puszczeniu. Puszczone skrzynki pozostają nieruchome, dopóki inny system nie zaktualizuje ich prędkości.

---

# Obsługa Wejścia

Funkcjonalność opiera się na systemie `Input` silnika.

## Wymagane Metody Input

```ts
input.isPressed("e")
```

Używane do jednorazowej interakcji chwytania/puszczania.

```ts
input.clearPressed()
```

Czyści stan naciśnięcia po przetworzeniu wejścia interakcji.

Zapobiega to wielokrotnemu chwytaniu w tej samej klatce.

---

# Renderowanie

Renderowanie wykorzystuje współdzielony renderer prostokątów:

```ts
renderBox(box, ctx)
```

który wewnętrznie wywołuje:

```ts
renderRect(box, ctx);
```

z `src/rect.ts`.

Sam system chwytania skrzynek nie zmienia zachowania renderowania.

---

# Integracja Demo

Demo w `src/demo/box-grab.ts` łączy:

* ruch gracza
* ruch taśmy transportowej
* spawn skrzynek
* obsługę kolizji
* chwytanie skrzynek

w kompletny przykład rozgrywki.

---

# Konfiguracja Gry

Demo tworzy:

## Taśmę Transportową

```ts
createConveyorBelt({
    centerX: 960,
    centerY: 60,
    length: 700,
    width: 40,
    gateWidth: 100,
    gateHeight: 100
});
```

---

## Fabrykę Skrzynek

```ts
createBoxFactory(conveyor, {
    maxBoxesOnConveyor: 4,
    spawnInterval: 1.5,
    boxSize: 20,
    boxSpeed: 80,
    spawnCounts: {
        red: 4,
        green: 4,
        yellow: 4,
        purple: 4
    }
});
```

Fabryka stale generuje skrzynki na taśmie transportowej, które później mogą zostać podniesione.

---

## Gracza

```ts
new Player(960 - 25, 350, 200, 50)
```

Gracz korzysta z systemu ruchu z `src/player.ts`.

Ruch jest sterowany klawiszami strzałek.

---

# Integracja z Pętlą Aktualizacji

Pętla aktualizacji demo koordynuje wszystkie systemy.

## Aktualizacja Gracza

```ts
const moved = state.player.update(dt, state.input);
```

Dźwięk ruchu jest odtwarzany, gdy gracz się porusza.

---

## Aktualizacja Taśmy i Skrzynek

```ts
updateBoxFactory(state.boxFactory, dt, playerState);
updateConveyorBelt(state.conveyor, dt);
```

Fabryka aktualizuje ruch skrzynek i czas generowania.

---

## Interakcja Chwytania

```ts
handleBoxGrab(
    state.boxFactory.boxes,
    playerState,
    state.input
);
```

Łączy to interakcję gracza bezpośrednio z aktywnymi skrzynkami na taśmie.

---

## Rozwiązywanie Kolizji

```ts
resolvePlayerRectCollisions(
    playerState,
    state.colliders
);
```

Ruch gracza jest ograniczany przez geometrię kolizji taśmy transportowej.

Zapewnia to, że chwytane skrzynki wizualnie poruszają się wraz z poprawnie ograniczonym graczem.

---

# Przepływ Renderowania

Kolejność renderowania wygląda następująco:

```ts
renderConveyorBelt(...)
renderBoxFactory(...)
player.render(...)
```

Zapewnia to:

1. taśmę transportową w tle
2. skrzynki nad taśmą
3. gracza renderowanego na końcu

dla poprawnego warstwowania wizualnego.

---

# Relacje Zależności

## `player.ts`

Zapewnia:

* ruch gracza
* interpolowane renderowanie
* pozycję i stan gracza używane do obliczeń chwytania

System chwytania zależy od:

```ts
player.x
player.y
player.size
```

do sprawdzania odległości i przesunięć podczas noszenia.

---

## `rect.ts`

Zapewnia współdzieloną abstrakcję prostokąta:

```ts
createRect()
renderRect()
```

Skrzynki dziedziczą całe renderowanie i zachowanie geometrii prostokąta poprzez `RectState`.

---

# Przepływ Rozgrywki

Pełny przebieg interakcji wygląda następująco:

1. Taśma transportowa generuje poruszające się skrzynki
2. Gracz podchodzi do skrzynki
3. Gracz naciska `E`
4. Najbliższa skrzynka przyczepia się do gracza
5. Ruch taśmy zostaje zatrzymany dla tej skrzynki
6. Skrzynka podąża za ruchem gracza
7. Gracz ponownie naciska `E`
8. Skrzynka zostaje puszczona w aktualnej pozycji

Tworzy to lekki system interakcji z obiektami odpowiedni dla mechanik związanych z taśmami transportowymi, sortowaniem lub rozgrywką w stylu fabrycznym.