## Box Game SRS

### Timer

- Start timer when player first move
- Stop it when player puts all grid boxes in zones
- In `timer.ts`
- Use it in `game.ts`

### High Score

- Persist high score list of 10 scores
- Use browser storage methods
- In `score.ts`
- Use it in `game.ts`
- Add reset high scores function

### Sprite

- Write sprite animator for any game object
- Sprite file format
  - Array of animation Arrays with pics
- For example 256x256 and 10 frames in first row, 15 frames in second row and so on
- Struct and functions
- Easy to use in game object
- Create spite, update its state and render
- Simple and lean but with all needed functionality to animate game objects with sprites
- Example usage in `player.ts`
