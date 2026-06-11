## Publish Instruction

- Add `vite.config.js` to set base path for GitHub Pages

```js
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/pages/box-game/',
})
```

- Build `dist`

```sh
pnpm build
```

- Copy dist content to repo `pages/box-game/`

- Copy `sounds` to repo `pages/box-game/sounds`

- Add index.md with link to page

- Trun on github pages on main and root

- Commit