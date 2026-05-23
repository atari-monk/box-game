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
{{include:src/game.ts}}
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
{{include:src/oop/game.ts}}
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
{{include:src/main.ts}}
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