[en](../box-factory.md)

# Fabryka pudełek

Fabryka pudełek odpowiada za tworzenie, aktualizowanie, śledzenie oraz renderowanie poruszających się pudełek na taśmie w świecie gry.

Działa jako lekki system gameplayowy, który znajduje się pomiędzy:

* taśmą transportową
* interakcją gracza
* indywidualnym zachowaniem pudełek

Fabryka **nie implementuje ruchu pudełek**. Zamiast tego koordynuje wiele instancji `BoxState` i deleguje logikę poszczególnych pudełek do modułu pudełka.

---

# Odpowiedzialności

Fabryka obsługuje:

* generowanie pasów (linii ruchu)
* spawnowanie w czasie
* limity spawnów
* ważoną/losową dystrybucję kolorów
* śledzenie aktywnych pudełek
* zajętość taśmy transportowej
* czyszczenie cyklu życia obiektów
* delegowanie renderowania

---

# Główne typy

## `BoxFactoryConfig`

Konfiguracja dla spawnowania i zachowania taśmy.

```ts
export type BoxFactoryConfig = {
    maxBoxesOnConveyor: number;
    spawnInterval: number;
    boxSize: number;
    boxSpeed: number;
    spawnCounts: {
        red: number;
        green: number;
        yellow: number;
        purple: number;
    };
};
```

## Właściwości

| Właściwość           | Opis                                    |
| -------------------- | --------------------------------------- |
| `maxBoxesOnConveyor` | Maksymalna liczba aktywnych pudełek     |
| `spawnInterval`      | Sekundy między próbami spawnu           |
| `boxSize`            | Szerokość i wysokość pudełek            |
| `boxSpeed`           | Prędkość pozioma taśmy                  |
| `spawnCounts`        | Całkowita liczba pudełek każdego koloru |

---

# `BoxFactoryState`

Stan runtime całej fabryki.

```ts
export type BoxFactoryState = {
    boxes: BoxState[];
    conveyorStartX: number;
    conveyorEndX: number;
    conveyorCenterY: number;
    conveyorWidth: number;
    lanes: number[];
    spawnTimer: number;
    config: BoxFactoryConfig;
    spawnCountsLeft: {
        red: number;
        green: number;
        yellow: number;
        purple: number;
    };
};
```

---

# Tworzenie fabryki

## `createBoxFactory`

Tworzy fabrykę i inicjalizuje pasy taśmy.

```ts
createBoxFactory(conveyor, config)
```

## Parametry

### `conveyor`

```ts
{
    startX: number;
    endX: number;
    config: ConveyorBeltConfig;
}
```

Fabryka wyciąga:

* granice taśmy
* szerokość taśmy
* pozycję środka
* układ pasów

### `config`

Konfiguracja spawnowania fabryki.

---

# Generowanie pasów

Fabryka dynamicznie tworzy linie ruchu na podstawie szerokości taśmy.

```ts
const laneCount = Math.max(1, Math.floor(config.width / 20));
```

Odstępy są równomiernie rozłożone w pionie na taśmie.

Przykład:

```txt
| pas 1 |
| pas 2 |
| pas 3 |
```

Wygenerowane pasy są przechowywane jako współrzędne Y:

```ts
lanes: number[]
```

Pozwala to spawnować pudełka na losowych rzędach, jednocześnie utrzymując ich wizualne wyrównanie do taśmy.

---

# Cykl aktualizacji

## `updateBoxFactory`

```ts
updateBoxFactory(factory, dt, player?)
```

To główna pętla runtime.

---

# Krok 1 — Aktualizacja istniejących pudełek

```ts
updateBox(box, dt, ...)
```

Każde pudełko aktualizuje się niezależnie poprzez moduł pudełka.

Fabryka przekazuje:

* delta time
* granice taśmy
* opcjonalny stan gracza

System pudełek obsługuje następnie:

* ruch po taśmie
* podnoszenie przez gracza
* zawijanie pozycji

---

# Krok 2 — Czyszczenie

```ts
factory.boxes = factory.boxes.filter(
    box => box.x < factory.conveyorEndX
);
```

Pudełka poza końcem taśmy są usuwane z aktywnej listy.

Zapobiega to gromadzeniu się nieużywanych encji.

---

# Krok 3 — Timer spawnu

```ts
factory.spawnTimer += dt;
```

Timer akumuluje czas aż do:

```ts
spawnTimer >= spawnInterval
```

---

# Krok 4 — Sprawdzenie pojemności taśmy

Fabryka ogranicza liczbę aktywnych obiektów na taśmie:

```ts
countBoxesOnConveyor(factory)
```

Pudełka aktualnie:

* trzymane przez gracza
* umieszczone w siatce

są wykluczane z licznika.

```ts
if (!box.grabbedByPlayer && !box.inGrid)
```

Pozwala to na interakcje gameplayowe bez blokowania spawnu.

---

# Krok 5 — Wybór koloru

Fabryka używa ważonego losowania na podstawie pozostałych ilości.

Przykład:

```ts
spawnCountsLeft = {
    red: 4,
    green: 2,
    yellow: 1,
    purple: 0
}
```

Prawdopodobieństwo automatycznie dostosowuje się wraz z wyczerpywaniem kolorów.

Gwarantuje to:

* dokładne całkowite limity spawnów
* losową kolejność
* brak nadmiarowego spawnowania

---

# Krok 6 — Tworzenie pudełka

Po wybraniu pasa i koloru:

```ts
const box = createBox(
    factory.conveyorStartX,
    y,
    color,
    factory.config.boxSize,
    factory.config.boxSpeed
);
```

Pudełko jest następnie dodawane do:

```ts
factory.boxes
```

---

# Renderowanie

## `renderBoxFactory`

```ts
renderBoxFactory(factory, ctx)
```

Renderowanie jest celowo proste:

```ts
for (const box of factory.boxes) {
    renderBox(box, ctx);
}
```

Fabryka deleguje całe renderowanie wizualne do modułu pudełka.

Utrzymuje to separację odpowiedzialności:

| System  | Odpowiedzialność    |
| ------- | ------------------- |
| Fabryka | orkiestracja        |
| Pudełko | wizualizacja + ruch |

---

# Relacja z `box.ts`

Fabryka silnie zależy od modułu pudełka.

## Fabryka używa

### `createBox`

Tworzy zainicjalizowane obiekty pudełek.

### `updateBox`

Obsługuje:

* ruch po taśmie
* podpięcie do gracza
* aktualizacje pozycji

### `renderBox`

Rysuje prostokąt pudełka.

---

# Integracja stanu pudełka

Każde stworzone pudełko zawiera:

```ts
type BoxState = RectState & {
    speed: number;
    grabbedByPlayer: boolean;
    inGrid: boolean;
    color: BoxColor;
}
```

Fabryka polega na:

| Właściwość        | Cel                                        |
| ----------------- | ------------------------------------------ |
| `grabbedByPlayer` | wyklucza niesione pudełka z licznika taśmy |
| `inGrid`          | wyklucza umieszczone pudełka               |
| `speed`           | kontrola ruchu                             |
| `color`           | kategoryzacja gameplayowa                  |

---

# Relacja z taśmą transportową

Fabryka jest świadoma taśmy, ale jej nie kontroluje.

Używa danych taśmy do określania:

* pozycji startowej spawnu
* granic despawnu
* rozmieszczenia pasów
* wymiarów taśmy

```ts
conveyor.startX
conveyor.endX
conveyor.config.width
conveyor.config.centerY
```

Taśma pozostaje odpowiedzialna za:

* wizualizację
* geometrię kolizji
* animację
* przełączniki gameplayowe

---

# Relacja z graczem

Gracz jest opcjonalny podczas aktualizacji:

```ts
updateBoxFactory(factory, dt, player?)
```

Pozwala to pudełkom:

* podążać za ruchem gracza
* pozostać przyczepionymi podczas podniesienia

Logika noszenia jest implementowana wewnątrz `updateBox`.

Fabryka jedynie przekazuje stan gracza do aktywnych pudełek.

---

# Integracja demo

## `BoxFactoryDemo`

Demo integruje:

* ruch gracza
* taśmę transportową
* kolizje
* system spawnowania pudełek

w grywalnej scenie testowej.

---

# Setup sceny

## Tworzenie taśmy

```ts
const conveyor = createConveyorBelt({
    centerX: 960,
    centerY: 60,
    length: 700,
    width: 40,
    gateWidth: 100,
    gateHeight: 100
});
```

Taśma staje się podstawą przestrzenną fabryki.

---

# Inicjalizacja fabryki

```ts
const boxFactory = createBoxFactory(conveyor, {
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

## Wynik

Demo generuje:

* cztery kolory pudełek
* losowe spawnowanie
* ograniczoną pojemność taśmy
* równomiernie rozmieszczone pasy

---

# Cykl aktualizacji runtime

W `updateGame`:

```ts
updateBoxFactory(state.boxFactory, dt, state.player.state);
```

Fabryka aktualizuje się przed rozwiązywaniem kolizji taśmy.

Zapewnia to, że:

1. pudełka się poruszają
2. interakcje gracza są aktualizowane
3. kolizje są rozwiązywane później

---

# Cykl renderowania

```ts
renderConveyorBelt(state.conveyor, ctx);
renderBoxFactory(state.boxFactory, ctx);
state.player.render(ctx, alpha);
```

Kolejność renderowania ma znaczenie:

| Warstwa | Cel                        |
| ------- | -------------------------- |
| Taśma   | tło systemu                |
| Pudełka | ruchome obiekty gry        |
| Gracz   | obiekt na pierwszym planie |

---

# Charakterystyka gameplayu

Demo pokazuje:

* ciągłe spawnowanie na taśmie
* ruch pudełek po pasach
* losową generację kolorów
* interakcje gracz/pudełko
* zarządzanie zajętością taśmy

Stanowi:

* sandbox gameplayowy
* test systemu spawnowania
* prototyp interakcji z taśmą

---

# Uwagi projektowe

Fabryka jest celowo lekka i oparta na danych.

Korzyści:

* przewidywalne spawnowanie
* niska zależność między modułami
* modularne renderowanie
* łatwa integracja z taśmą
* prosta rozbudowa gameplayu

Przyszłe systemy mogą rozszerzyć fabrykę o:

* system punktacji
* dopasowywanie pudełek
* strefy dostawy
* mechaniki składania
* podnoszenie/odkładanie obiektów
* object pooling
* skryptowanie spawnów
* skalowanie trudności