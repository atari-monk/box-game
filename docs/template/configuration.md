## Configuration

### Typescript Config

```json
{{include:tsconfig.json}}
```

### Package Config

```json
{{include:package.json}}
```

### .gitignore

```txt
{{include:.gitignore}}
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