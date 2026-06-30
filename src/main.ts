import './style.css'
import {
    Renderer,
    Input,
    Audio,
    GameLoop
} from "atari-monk-atom-engine";
import { createGame, updateGame, renderGame } from "./game";

const renderer = new Renderer("canvas");
const input = new Input();
const audio = new Audio();

const game = createGame(renderer, input, audio);

(async () => {
    await audio.load("move", "./sounds/a.wav");
    await audio.load("bg", "./sounds/a.wav");
})();

const overlay = document.getElementById("start-overlay");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

overlay?.addEventListener("click", async () => {
    overlay.style.display = "none";
    canvas.style.display = "block";

    await audio.playMusicAfterGesture("bg", 0.5);
});

const loop = new GameLoop(
    (dt) => updateGame(game, dt),
    (alpha) => renderGame(game, alpha)
);

loop.start();