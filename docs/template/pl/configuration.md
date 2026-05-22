## Konfiguracja

### Konfiguracja TypeScript

```json
{{include:tsconfig.json}}
```

### Konfiguracja pakietu

```json
{{include:package.json}}
```

### .gitignore

```txt
{{include:.gitignore}}
```

## Dokumenty

- Folder 'docs'
- Pliki w formacie md służące do prowadzenia i dokumentowania projektu
- Wykorzystanie szablonów do wstrzykiwania kodu do dokumentów

## Prompts

- Folder 'prompts'
- Szablony z wstrzykiwaniem kodu w celu generowania promptów llm

## Scripts

- scripts/assemble.js
    - Wstrzykuje kod do szablonów

Ustaw ścieżkę bazową:

```sh
const basePath = "/home/atari-monk/atari-monk/project/box-game";
```

Wygeneruj alias:

```sh
alias prompt="node assemble.js"
```

Instalacja zależności:

```sh
pnpm i clipboardy
```

Użycie:

```sh
prompt docs/template/configuration.md
```

### Instalacja

- Zainicjuj repozytorium git
- Utwórz folder src
- Zainstaluj moduły:

```sh
pnpm i
```

- Początkowy komit
- Włącz strony GitHub na folderze docs