import "./styles.css";
import {
    Renderer,
    Input,
    Audio,
    GameLoop
} from "atari-monk-light-engine";
import { PlayerDemo } from "./demo/player";
import { RectDemo } from "./demo/rect";
import { ConveyorBeltDemo } from "./demo/conveyor-belt";
import { BoxDemo } from "./demo/box";
import { BoxFactoryDemo } from "./demo/box-factory";
import { Game } from "./oop/game";

const renderer = new Renderer("canvas");
const input = new Input();

const audio = new Audio();

(async () => {
    await audio.load("move", "./sounds/move.wav");
    await audio.load("bg", "./sounds/bg.mp3");
})();

const game = new Game(renderer, input, audio);

const overlay = document.getElementById("start-overlay");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

overlay?.addEventListener("click", async () => {
    overlay.style.display = "none";
    canvas.style.display = "block";

    await audio.playMusicAfterGesture("bg", 0.5);
});

const loop = new GameLoop(
    (dt) => game.update(dt),
    (alpha) => game.render(alpha)
);

loop.start();