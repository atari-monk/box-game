[en](../configuration.md)

## Konfiguracja

### Konfiguracja TypeScript

```json
// FILE: tsconfig.json
{
    "compilerOptions": {
        "target": "ES2022",
        "useDefineForClassFields": true,
        "module": "ESNext",
        "lib": [
            "ES2022",
            "DOM",
            "DOM.Iterable"
        ],
        "types": [
            "vite/client"
        ],
        "skipLibCheck": true,
        /* Bundler mode */
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "verbatimModuleSyntax": true,
        "moduleDetection": "force",
        "noEmit": true,
        /* Linting */
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "erasableSyntaxOnly": false,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedSideEffectImports": true
    },
    "include": [
        "src"
    ]
}
```

### Konfiguracja pakietu

```json
// FILE: package.json
{
    "name": "box-game",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
    },
    "devDependencies": {
        "typescript": "~5.9.3",
        "vite": "^8.0.0-beta.13"
    },
    "pnpm": {
        "overrides": {
            "vite": "^8.0.0-beta.13"
        }
    },
    "dependencies": {
        "atari-monk-light-engine": "^0.0.1",
        "clipboardy": "^5.3.1"
    },
    "packageManager": "pnpm@10.30.3+sha512.c961d1e0a2d8e354ecaa5166b822516668b7f44cb5bd95122d590dd81922f606f5473b6d23ec4a5be05e7fcd18e8488d47d978bbe981872f1145d06e9a740017"
}
```

### .gitignore

```txt
// FILE: .gitignore
node_modules
dist
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