[en](../player.md)

# Podstawowy/prototypowy gracz - Dokumentacja 

Ten dokument wyjaśnia, jak działa **system Playera** w silniku — obejmuje zarówno implementację proceduralną, jak i wrapper OOP, a także sposób integracji z pętlą gry.

---

# 1. Przegląd

Player to prosta encja 2D, która:

* Porusza się za pomocą klawiszy strzałek
* Ma stałą prędkość ruchu
* Jest renderowana jako czerwony kwadrat
* Wspiera interpolację dla płynnego renderowania między klatkami
* Wyzwala dźwięk ruchu przez warstwę gry

Implementacja jest podzielona na:

* **API proceduralne (`src/player.ts`)** — logika i funkcje stanu
* **Wrapper OOP (`src/oop/player.ts`)** — abstrakcja klasowa
* **Integracja z grą (`src/game.ts`)** — łączenie Playera z rendererem, inputem i audio

---

# 2. Stan Playera

```ts
export type PlayerState = {
    x: number;
    y: number;

    prevX: number;
    prevY: number;

    speed: number;
    size: number;
};
```

### Pola

* **x, y** → aktualna pozycja
* **prevX, prevY** → poprzednia pozycja (używana do interpolacji)
* **speed** → prędkość ruchu w pikselach na sekundę
* **size** → rozmiar renderowanego kwadratu

---

# 3. Proceduralne API Playera

## 3.1 Tworzenie Playera

```ts
createPlayer(x?, y?, speed?, size?)
```

Tworzy i zwraca nowy stan Playera.

### Wartości domyślne:

* x = 100
* y = 200
* speed = 200
* size = 50

### Przykład:

```ts
const player = createPlayer(150, 300);
```

---

## 3.2 Aktualizacja Playera

```ts
updatePlayer(state, dt, input): boolean
```

Aktualizuje pozycję gracza na podstawie inputu z klawiatury.

### Obsługa inputu

Player używa klawiszy strzałek:

| Klawisz    | Kierunek |
| ---------- | -------- |
| ArrowRight | +X       |
| ArrowLeft  | -X       |
| ArrowUp    | -Y       |
| ArrowDown  | +Y       |

### Zachowanie ruchu

* Ruch jest znormalizowany → ruch po skosie nie jest szybszy
* Ruch jest niezależny od klatki (`dt` jest uwzględniane)
* Prędkość skaluje końcowy ruch

### Kroki wewnętrzne

1. Zapisz poprzednią pozycję
2. Odczytaj input i zbuduj wektor kierunku `(dx, dy)`
3. Znormalizuj wektor (jeśli występuje ruch)
4. Zastosuj ruch:

   ```ts
   state.x += dx * state.speed * dt;
   state.y += dy * state.speed * dt;
   ```
5. Zwróć:

   * `true` → player się poruszył
   * `false` → brak inputu

### Przykład:

```ts
const moved = updatePlayer(player, dt, input);

if (moved) {
    console.log("Player się poruszył");
}
```

---

## 3.3 Renderowanie Playera

```ts
renderPlayer(state, ctx, alpha)
```

Renderuje Playera jako **czerwony kwadrat**.

### Kluczowa cecha: interpolacja

Zamiast renderować bezpośrednio `x/y`, Player używa interpolacji:

```ts
interpolated = prev + (current - prev) * alpha;
```

Dzięki temu ruch jest płynny między tickami aktualizacji.

### Kroki renderowania

1. Oblicz interpolowaną pozycję:

   * `interpolatedX`
   * `interpolatedY`
2. Ustaw kolor na czerwony
3. Narysuj kwadrat używając `fillRect`

### Przykład:

```ts
renderPlayer(player, ctx, alpha);
```

---

# 4. Wrapper OOP (klasa Player)

Plik: `src/oop/player.ts`

Klasa `Player` opakowuje API proceduralne w interfejs obiektowy.

## 4.1 Cel

* Enkapsulacja `PlayerState`
* Czysta integracja z systemami gry
* Reużywalność logiki proceduralnej
* Wygodny dostęp getter/setter do pozycji

---

## 4.2 Konstruktor

```ts
new Player(x?, y?, speed?, size?)
```

Tworzy wewnętrzny stan przez `createPlayer`.

### Przykład:

```ts
const player = new Player(100, 200);
```

---

## 4.3 Metody

### update

```ts
update(dt, input): boolean
```

Deleguje do:

```ts
updatePlayer(this.state, dt, input);
```

Zwraca informację, czy nastąpił ruch.

---

### render

```ts
render(ctx, alpha)
```

Deleguje do:

```ts
renderPlayer(this.state, ctx, alpha);
```

---

## 4.4 Dostęp do pozycji

### Getter

```ts
player.x;
player.y;
```

Zwraca aktualną pozycję.

### Setter

```ts
player.x = 300;
player.y = 400;
```

Bezpośrednio modyfikuje stan wewnętrzny.

---

# 5. Integracja z grą

Plik: `src/game.ts`

Player jest zintegrowany z pętlą gry poprzez `GameState`.

---

## 5.1 Struktura GameState

```ts
export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    player: Player;
};
```

Player zależy od:

* Input → sterowanie ruchem
* Renderer → rysowanie
* Audio → efekty dźwiękowe

---

## 5.2 Tworzenie gry

```ts
createGame(renderer, input, audio)
```

Inicjalizuje:

* Renderer
* Input
* Audio
* Player (pozycja domyślna)

```ts
player: new Player()
```

---

## 5.3 Pętla aktualizacji

```ts
updateGame(state, dt)
```

### Przepływ:

1. Aktualizacja Playera:

   ```ts
   const moved = state.player.update(dt, state.input);
   ```

2. Jeśli nastąpił ruch:

   ```ts
   state.audio.play("move");
   ```

### Zachowanie:

* Dźwięk odtwarzany tylko przy ruchu
* Brak spamowania audio przy bezczynności

---

## 5.4 Pętla renderowania

```ts
renderGame(state, alpha)
```

### Przepływ:

1. Wyczyść ekran:

   ```ts
   state.renderer.clear();
   ```

2. Renderuj Playera:

   ```ts
   state.player.render(state.renderer.ctx, alpha);
   ```

---

## 5.5 Inicjalizacja muzyki

```ts
startGameMusic(state)
```

Odtwarza muzykę tła:

```ts
state.audio.playMusic("bg", 0.5);
```

* `"bg"` → ścieżka tła
* `0.5` → poziom głośności

---

# 6. Podsumowanie

### Warstwa proceduralna

* `createPlayer` → tworzy stan
* `updatePlayer` → logika ruchu
* `renderPlayer` → render interpolowanego sprite’a

### Warstwa OOP

* Klasa `Player` opakowuje stan
* Deleguje logikę do funkcji proceduralnych
* Dodaje czytelny interfejs dla systemów gry

### Warstwa gry

* Obsługuje pętlę update/render
* Wyzwala audio przy ruchu
* Łączy input, rendering i logikę Playera

---

Jeśli chcesz, mogę też rozszerzyć dokumentację o:

* system kolizji
* kamerę podążającą
* ścieżkę rozwoju fizyki
* model synchronizacji multiplayer