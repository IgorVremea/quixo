import { Controller } from "./scripts/Controller.js";
import CONFIG from "./config.js";
import { RB } from "./scripts/button.js";

function setup() {
  let canvas = createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
  canvas.parent("game-div");

  // 1. Inițializăm controller-ul local
  const controller = new Controller();

  // 2. REPARAȚIA: Îl facem vizibil global pentru Board.js și alte fișiere!
  window.controller = controller;

  // Conectăm butoanele din HTML
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.onclick = () => {
      controller.showFormBtnHanddle();
    };
  }

  const startGameRealBtn = document.getElementById("startGameRealBtn");
  if (startGameRealBtn) {
    startGameRealBtn.onclick = () => {
      controller.startGameBtnHanddle();
    };
  }

  document.getElementById("game-div").classList.add("hidden");
}

function draw() {
  if (!controller) return;
  controller.tick();
  RB.drawButton();
}

function mousePressed() {
  if (!controller || !controller.board) return;
  RB.mousePressedButton();
  let clickedCell = controller.board.getHoveredCell();
  controller.cellClick(clickedCell);
}

// Ofertăm acces global funcțiilor p5 pentru ca librăria externă p5.js să le poată apela din modul
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
