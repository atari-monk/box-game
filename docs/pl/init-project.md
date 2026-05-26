[en](../init-project.md)

## Dokumentacja skryptu inicjalizacji projektu

### Przegląd

`init-project.ps1` to skrypt automatyzacji PowerShell, który tworzy strukturę projektu na podstawie pliku konfiguracyjnego JSON. Odczytuje on zdefiniowaną listę folderów i plików z `init-project.json` i zapewnia ich istnienie w docelowym katalogu bazowym.

Skrypt został zaprojektowany jako idempotentny: jego wielokrotne uruchomienie nie nadpisuje istniejących plików ani folderów — tworzy jedynie brakujące elementy.

---

## Co robi skrypt

Na wysokim poziomie skrypt wykonuje następujące kroki:

1. **Wczytuje konfigurację**

   * Odczytuje `init-project.json`
   * Konwertuje go do silnie typowanego obiektu `ProjectConfig`

2. **Rozwiązuje ścieżki**

   * Łączy `basePath` z każdą względną ścieżką folderu/pliku

3. **Tworzy foldery**

   * Zapewnia istnienie każdego folderu z listy w konfiguracji
   * Tworzy tylko brakujące katalogi

4. **Tworzy pliki**

   * Zapewnia istnienie każdego pliku z listy w konfiguracji
   * Tworzy puste pliki, jeśli nie istnieją

5. **Wyświetla komunikaty statusu**

   * Loguje każdą operację tworzenia lub pomijania w konsoli

6. **Wyświetla komunikat zakończenia**

   * Potwierdza zakończenie inicjalizacji

---

## Opis danych

### Klasa ProjectConfig

Skrypt używa prostego modelu danych:

```powershell
class ProjectConfig {
    [string]$BasePath
    [string[]]$Folders
    [string[]]$Files
}
```

#### Właściwości:

* **BasePath**

  * Katalog główny, w którym zostanie utworzony projekt
  * Przykład: `/home/atari-monk/atari-monk/project/box-game`

* **Folders**

  * Tablica względnych ścieżek folderów do utworzenia w `BasePath`
  * Przykład:

    * `src`
    * `scripts`
    * `src/oop`

* **Files**

  * Tablica względnych ścieżek plików do utworzenia w `BasePath`
  * Przykład:

    * `package.json`
    * `src/main.ts`
    * `src/oop/game.ts`

---

### Plik konfiguracyjny (init-project.json)

Plik JSON definiuje całą strukturę projektu:

```json
{
  "basePath": "/home/atari-monk/atari-monk/project/box-game",
  "folders": [
    "src",
    "scripts",
    "docs",
    "prompts",
    "sounds",
    "src/oop"
  ],
  "files": [
    "package.json",
    "tsconfig.json",
    ".gitignore",
    "index.html",
    "favicon.png",
    "src/styles.css",
    "src/player.ts",
    "src/game.ts",
    "src/main.ts",
    "src/oop/game.ts",
    "src/oop/player.ts"
  ]
}
```

#### Kluczowe założenia:

* **basePath**

  * Bezwzględny katalog główny projektu

* **folders**

  * Definicje struktury katalogów

* **files**

  * Tworzenie plików (puste pliki)

---

## Wewnętrzny podział funkcji

### Load-ProjectConfig

* Wczytuje plik konfiguracyjny JSON
* Waliduje jego istnienie
* Konwertuje JSON do obiektu `ProjectConfig`

### Join-ProjectPath

* Łączy ścieżkę bazową ze ścieżkami względnymi
* Używa `Join-Path` PowerShell dla bezpiecznej obsługi ścieżek w systemie

### Create-Folder

* Tworzy katalog, jeśli nie istnieje
* Wyświetla komunikat statusu

### Create-File

* Tworzy pusty plik, jeśli nie istnieje
* Wyświetla komunikat statusu

### Initialize-Folders

* Iteruje przez listę folderów
* Tworzy każdy folder w katalogu bazowym

### Initialize-Files

* Iteruje przez listę plików
* Tworzy każdy plik w katalogu bazowym

### Main

* Punkt wejścia
* Wczytuje konfigurację
* Uruchamia inicjalizację folderów i plików
* Wyświetla komunikat zakończenia

---

## Użycie

### 1. Przygotowanie konfiguracji

Edytuj lub utwórz:

```
scripts/init-project.json
```

Zdefiniuj:

* `basePath`
* strukturę folderów
* strukturę plików

---

### 2. Uruchomienie skryptu

W terminalu PowerShell:

```powershell
cd scripts
.\init-project.ps1
```

---

### 3. Przykładowe wyjście

Przykładowy wynik:

```
Created folder: /home/.../box-game/src
Created folder: /home/.../box-game/scripts
Created file: /home/.../box-game/package.json
Created file: /home/.../box-game/src/main.ts

box-game init project complete
```

Jeśli elementy już istnieją:

```
Folder already exists: ...
File already exists: ...
```

---

### 4. Bezpieczeństwo ponownego uruchomienia

Skrypt można uruchamiać wielokrotnie:

* Brak duplikacji
* Brak nadpisywania
* Tworzone są tylko brakujące elementy

---

## Podsumowanie

Ten skrypt to lekkie narzędzie do tworzenia struktury projektu, które:

* Odczytuje deklaratywną strukturę JSON
* Automatycznie buduje strukturę folderów i plików
* Nie nadpisuje istniejącej pracy
* Umożliwia powtarzalną inicjalizację projektu

Jest szczególnie przydatny do szybkiego tworzenia spójnych struktur projektów (np. gier, aplikacji frontendowych lub modularnych baz kodu).