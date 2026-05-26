[en](../rect-collision.md)

# Kolizja Gracza z Prostokątami

System kolizji rozwiązuje nakładanie się gracza i prostokątów wyrównanych do osi (`RectState`) poprzez rozdzielenie ruchu na dwa niezależne etapy:

1. Rozwiązywanie kolizji poziomych (`x`)
2. Rozwiązywanie kolizji pionowych (`y`)

Takie podejście zapobiega przenikaniu gracza przez ściany, jednocześnie umożliwiając płynne ślizganie się po powierzchniach.

---

## Wykrywanie Kolizji

Funkcja pomocnicza `intersects()` wykonuje test nakładania AABB (Axis-Aligned Bounding Box).

```ts
function intersects(
    px: number,
    py: number,
    size: number,
    rect: RectState
) {
    return (
        px < rect.x + rect.width &&
        px + size > rect.x &&
        py < rect.y + rect.height &&
        py + size > rect.y
    );
}
````

### Parametry

| Parametr   | Opis                    |
| ---------- | ----------------------- |
| `px`, `py` | Pozycja gracza          |
| `size`     | Rozmiar kwadratu gracza |
| `rect`     | Prostokątny collider    |

### Zwraca

`true`, gdy gracz nakłada się na prostokąt.

---

# Rozwiązywanie Kolizji

```ts
resolvePlayerRectCollisions(player, rects)
```

Resolver wykorzystuje pozycję gracza z poprzedniej klatki do określenia kierunku ruchu i bezpiecznego rozwiązania kolizji.

---

## Delta Ruchu

```ts
const dx = player.x - player.prevX;
const dy = player.y - player.prevY;
```

Delta ruchu informuje system:

* jak daleko poruszył się gracz
* w jakim kierunku poruszył się gracz

---

## Reset do Poprzedniej Pozycji

```ts
player.x = player.prevX;
player.y = player.prevY;
```

Gracz jest tymczasowo przywracany do ostatniej pozycji bez kolizji przed rozpoczęciem rozwiązywania kolizji.

Pozwala to uniknąć problemów z głębokim przenikaniem.

---

# Etap Kolizji Poziomych

```ts
player.x += dx;
```

Najpierw stosowany jest ruch poziomy.

Następnie sprawdzany jest każdy prostokąt:

```ts
for (const rect of rects) {
    if (!intersects(player.x, player.y, size, rect)) continue;

    if (dx > 0) {
        player.x = rect.x - size;
    } else if (dx < 0) {
        player.x = rect.x + rect.width;
    }
}
```

---

## Ruch w Prawo

```ts
player.x = rect.x - size;
```

Jeśli ruch odbywa się w prawo (`dx > 0`):

* prawa krawędź gracza zostaje dosunięta do lewej krawędzi prostokąta

---

## Ruch w Lewo

```ts
player.x = rect.x + rect.width;
```

Jeśli ruch odbywa się w lewo (`dx < 0`):

* lewa krawędź gracza zostaje dosunięta do prawej krawędzi prostokąta

---

# Etap Kolizji Pionowych

Po rozwiązaniu kolizji poziomych:

```ts
player.y += dy;
```

Ten sam proces jest powtarzany pionowo.

```ts
for (const rect of rects) {
    if (!intersects(player.x, player.y, size, rect)) continue;

    if (dy > 0) {
        player.y = rect.y - size;
    } else if (dy < 0) {
        player.y = rect.y + rect.height;
    }
}
```

---

## Ruch w Dół

```ts
player.y = rect.y - size;
```

Jeśli ruch odbywa się w dół:

* gracz ląduje na górnej krawędzi prostokąta

---

## Ruch w Górę

```ts
player.y = rect.y + rect.height;
```

Jeśli ruch odbywa się w górę:

* gracz zostaje wypchnięty pod prostokąt

---

# Dlaczego Rozdzielać Osie?

Rozwiązywanie jednej osi na raz zapewnia stabilne zachowanie kolizji.

Zalety:

* płynne ślizganie się po ścianach
* zapobieganie blokowaniu się w rogach
* prostsza logika
* przewidywalna kolejność rozwiązywania

Bez rozdzielania osi ruch diagonalny często powoduje drgania lub niepoprawne wypychanie.

---

# Integracja z Grą

Rozwiązywanie kolizji jest zintegrowane wewnątrz `updateGame()` po ruchu gracza.

```ts
export function updateGame(
    state: GameState,
    dt: number
) {
    const moved = state.player.update(dt, state.input);

    if (moved) {
        state.audio.play("move");
    }

    resolvePlayerRectCollisions(
        state.player.state,
        [state.rect_c.state, state.rect_d.state]
    );
}
```

---

## Przepływ Aktualizacji

Pipeline aktualizacji gry działa w następujący sposób:

```text
Input
  ↓
Ruch Gracza
  ↓
Rozwiązywanie Kolizji
  ↓
Renderowanie
```

---

## Aktualne Prostokąty Kolizyjne

Obecnie tylko te prostokąty blokują gracza:

```ts
[state.rect_c.state, state.rect_d.state]
```

Są renderowane jako pełne obiekty kolizyjne.

---

## Prostokąty Bez Kolizji

`rect_a` i `rect_b` są renderowane wizualnie, ale nie są uwzględniane podczas rozwiązywania kolizji.

```ts
state.rect_a.render(ctx);
state.rect_b.render(ctx);
```

Pozwala to tworzyć dekoracyjne lub tła geometryczne bez fizycznej kolizji.

---

# Przykładowy Scenariusz Kolizji

Gracz poruszający się w prawo w kierunku ściany:

```text
Przed ruchem:
[P]

Po ruchu:
    [P][ŚCIANA]

Rozwiązanie kolizji:
   [P][ŚCIANA]
```

Gracz zostaje dosunięty do krawędzi ściany i nie może wejść do wnętrza prostokąta.

---

# Podsumowanie

System kolizji:

* wykorzystuje testy nakładania AABB
* rozwiązuje ruch jedną osią na raz
* przywraca poprzednią bezpieczną pozycję przed rozwiązaniem kolizji
* obsługuje płynne ślizganie się po ścianach
* integruje się bezproblemowo z pętlą aktualizacji gry

Ten projekt jest lekki, deterministyczny i idealny dla systemów ruchu 2D opartych na kafelkach lub prostokątach.