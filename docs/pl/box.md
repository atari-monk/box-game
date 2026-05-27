[en](../box.md)

# 📦 Dokumentacja modułu Box (zaktualizowana)

Moduł `box.ts` definiuje **ruchomy, renderowalny prostokątny byt** z opcjonalną interakcją gracza i kompatybilnością z kolizjami.

Opiera się na `rect.ts` i rozszerza go o:

* Autonomiczny ruch poziomy
* Obsługę „podniesienia” przez gracza (przyklejenie do gracza)
* Kompatybilność z kolizjami poprzez `RectState`
* Dodatkowe flagi stanu gameplayowego

---

# 🧠 Stan Boxa

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

| Właściwość            | Typ      | Opis                                   |
| --------------------- | -------- | -------------------------------------- |
| `x, y`                | number   | Pozycja (z `RectState`)                |
| `width, height`       | number   | Rozmiar (z `RectState`)                |
| `color`               | BoxColor | Logiczny identyfikator koloru          |
| `speed`               | number   | Prędkość ruchu poziomego               |
| `grabbedByPlayer`     | boolean  | Jeśli true, box podąża za graczem      |
| `inGrid`              | boolean  | Zarezerwowana flaga gameplayowa        |
| `offsetX` / `offsetY` | number   | Przesunięcie przy przypięciu do gracza |

---

# 🧱 createBox

```ts
createBox(
    x: number,
    y: number,
    color: BoxColor,
    size = 20,
    speed = 80
): BoxState
```

## Zachowanie

Tworzy prostokąt z:

* Półprzezroczystym kolorem bazującym na `color`
* Domyślnym rozmiarem kwadratu
* Prędkością ruchu poziomego
* Początkowo nieaktywnym stanem interakcji

## Mapowanie kolorów

```ts
red    -> rgba(255,0,0,.5)
green  -> rgba(0,255,0,.5)
yellow -> rgba(255,255,0,.5)
purple -> rgba(128,0,128,.5)
```

---

# 🔄 updateBox (główna logika)

```ts
updateBox(
    box: BoxState,
    dt: number,
    startX: number,
    endX: number,
    player?: PlayerState
)
```

## 1. Tryb podniesienia przez gracza

Jeśli box jest podniesiony:

```ts
if (box.grabbedByPlayer && player) {
    box.x = player.x + (box.offsetX ?? 0);
    box.y = player.y + (box.offsetY ?? 0);
    return;
}
```

### Efekt

* Box zostaje **przyklejony do gracza**
* Ruch jest w pełni kontrolowany przez pozycję gracza
* Offset zachowuje względne miejsce „chwycenia”

---

## 2. Tryb bezczynności / wyłączonego ruchu

```ts
if (box.speed === 0) return;
```

* Box staje się statyczny, jeśli prędkość wynosi 0
* Nadal bierze udział w kolizjach

---

## 3. Automatyczny ruch poziomy

```ts
box.x += box.speed * dt;
```

Boxy poruszają się ciągle w prawo z użyciem delta time.

---

## 4. Zawijanie ekranu

```ts
if (box.x > endX) {
    box.x = startX;
}
```

Tworzy to efekt **nieskończonej taśmy produkcyjnej**.

---

# 🎨 renderBox

```ts
renderBox(
    box: BoxState,
    ctx: CanvasRenderingContext2D
)
```

Deleguje renderowanie do:

```ts
renderRect(box, ctx);
```

Nie dodano żadnej dodatkowej logiki renderowania poza kolorem i rysowaniem prostokąta.

---

# 🎮 Integracja demo (BoxDemo)

Klasa `BoxDemo` pokazuje, jak boxy działają w pełnej pętli gry w ramach silnika.

```ts
export class BoxDemo implements IGame {
```

Integruje:

* Renderer
* System wejścia (input)
* Audio
* System gracza
* System kolizji
* System boxów

---

# 🧩 Stan gry

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

## Kluczowe zależności

### boxes

```ts
boxes: BoxState[]
```

Aktywne, ruchome obiekty gameplayowe.

---

### colliders

```ts
colliders: RectState[]
```

Wejście systemu kolizji.

Istotny szczegół:

> Boxy są bezpośrednio dodawane do colliders, ponieważ `BoxState extends RectState`

```ts
colliders: [...boxes]
```

To pozwala na **zerowy koszt konwersji** między gameplayem a fizyką.

---

# 🏗️ Inicjalizacja gry

```ts
const boxes = [
    createBox(650, 200, "red"),
    createBox(650, 230, "green"),
    createBox(650, 260, "yellow"),
    createBox(650, 290, "purple")
];
```

### Układ

* Pionowe ułożenie
* Ta sama pozycja X
* Różne pozycje Y
* Niezależne stany ruchu

---

# 🔁 Pętla aktualizacji

## 1. Aktualizacja gracza

```ts
const moved = state.player.update(dt, state.input);
```

Zwraca informację, czy gracz się poruszył.

---

## 2. Feedback audio

```ts
if (moved) {
    state.audio.play("move");
}
```

Prosty feedback powiązany z ruchem.

---

## 3. Symulacja boxów

```ts
for (const box of state.boxes) {
    updateBox(box, dt, 650, 650 + 300);
}
```

### Zakres ruchu:

* Start: `650`
* Koniec: `950`

Każdy box:

* porusza się w prawo
* zawija się na początek
* pozostaje aktywny w systemie kolizji

---

## 4. Rozwiązywanie kolizji

```ts
resolvePlayerRectCollisions(
    state.player.state,
    state.colliders
);
```

### Co się dzieje:

* Prostokąt gracza jest testowany względem wszystkich colliderów
* Collidery zawierają boxy
* Kolizje są agnostyczne typowo dzięki `RectState`

---

# 🖼️ Pętla renderowania

## 1. Czyszczenie ekranu

```ts
state.renderer.clear();
```

---

## 2. Render boxów

```ts
for (const box of state.boxes) {
    renderBox(box, state.renderer.ctx);
}
```

* Rysuje wszystkie ruchome obiekty
* Kolejność nie wpływa na logikę gry

---

## 3. Render gracza

```ts
state.player.render(ctx, alpha);
```

* Renderowany po boxach
* Używa interpolacji (`alpha`) dla płynnego ruchu

---

# 🔗 Relacje zależności

## rect.ts (warstwa bazowa)

Dostarcza:

* `RectState`
* `createRect`
* `renderRect`

Używane przez:

* system boxów
* system kolizji
* integrację kolizji gracza

---

## box.ts (warstwa obiektów gameplayowych)

Bazuje na:

* `RectState` (kontrakt geometrii)
* `renderRect` (współdzielone renderowanie)

Rozszerza o:

* system ruchu
* stan interakcji z graczem
* flagi gameplayowe

---

## player.ts (warstwa aktora)

Dostarcza:

* ruch + obsługę inputu
* interpolowane renderowanie
* historię pozycji (`prevX/prevY`)

Używane przez:

* logikę chwytania boxów
* system kolizji

---

## system kolizji (zewnętrzny)

```ts
resolvePlayerRectCollisions(player, colliders)
```

Zużywa:

* prostokąt gracza
* prostokąty boxów (przez `colliders`)

---

# 🧩 Podsumowanie architektury

System pokazuje czystą, warstwową architekturę:

### 1. Warstwa geometrii

`RectState`

→ czysty kształt danych

---

### 2. Warstwa encji

`BoxState`, `PlayerState`

→ dodaje zachowanie i stan

---

### 3. Warstwa symulacji

`updateBox`, `updatePlayer`

→ deterministyczna logika aktualizacji

---

### 4. Warstwa silnika

`BoxDemo`

→ orkiestruje:

* input
* audio
* pętlę update
* renderowanie
* kolizje

---

# 📌 Kluczowe ulepszenia w obecnym kodzie (vs dokumentacja)

* ✔ Boxy mogą być **chwytane przez gracza**
* ✔ Boxy wspierają **offsetowe przypięcie**
* ✔ Boxy mają **dodatkowe flagi stanu (`inGrid`)**
* ✔ Gracz może pośrednio wpływać na pozycję boxa
* ✔ System kolizji jest w pełni polimorficzny typowo przez `RectState`
* ✔ Ruch może być wyłączony przez `speed = 0`

---

# 🧾 Finalne podsumowanie

Obecny system boxów nie jest już tylko systemem ruchomych przeszkód.

Teraz wspiera:

* Ruch autonomiczny
* Interakcję z graczem (chwytanie)
* Udział w kolizjach
* Wspólny model renderowania
* Rozszerzalne flagi gameplayowe

`BoxDemo` spina to wszystko w minimalną, ale kompletną pętlę gry, gdzie:

> Wejście → Gracz → Boxy → Kolizje → Renderowanie → Feedback audio

Jeśli chcesz, mogę następnie:

* przerobić to na ECS
* albo zaproponować ulepszenia kolizji i chwytania
* albo narysować cały pipeline aktualizacji wizualnie