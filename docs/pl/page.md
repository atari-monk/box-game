[en](../page.md)

## Strona

Minimalna konfiguracja do uruchomienia strony internetowej z 'atari-monk-light-engine'.

### Html

```html
// FILE: index.html
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Box Game</title>
</head>

<div id="start-overlay">
    Click to Start
</div>
<canvas id="canvas"></canvas>

<body>
    <script type="module" src="/src/main.ts"></script>
</body>

</html>
```

### Style

```css
// FILE: index.html
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Box Game</title>
</head>

<div id="start-overlay">
    Click to Start
</div>
<canvas id="canvas"></canvas>

<body>
    <script type="module" src="/src/main.ts"></script>
</body>

</html>
```

Importuj style w 'src/main.ts'

```ts
import "./styles.css";
```

### Favicon

- 512x512 png z przezroczystym tłem
- obraz kształtu gamepada wygenerowany przez sztuczną inteligencję
- warstwy dopasowane do rozmiaru za pomocą programu Gimp