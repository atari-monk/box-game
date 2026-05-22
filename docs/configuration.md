[pl](pl/configuration.md)

## Configuration

### Typescript Config

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

### Package Config

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

## Docs

- Folder 'docs'
- Files in md format driving and documenting project
- Use of templates to inject code into docs

## Prompts

- Folder 'prompts'
- Templates with code injection to produce llm prompts

## Scripts

- scripts/assemble.js
    - Inject code into templates

Generate alias:

```sh
alias prompt="node assemble.js"
```

Zainstaluj zależności:

```sh
pnpm i clipboardy
```

Usage:

```sh
prompt docs/template/configuration.md
```

### Installation

- Initialize git repo
- Make src folder
- Install modules:

```sh
pnpm i
```

- Initial commit
- Turn on github pages on docs