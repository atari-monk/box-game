[pl](pl/page.md)

## Page

Minimal setup to run web page with 'atari-monk-light-engine'.

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

### Styles

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

Import styles in 'src/main.ts'

```ts
import "./styles.css";
```

### Favicon

- 512x512 png with transparent background
- gamepad shape image generated with ai
- layers fit to size with gimp