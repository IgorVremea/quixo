import { Controller } from "./scripts/Controller.js";

import CONFIG from "./config.js";

import { RB } from "./scripts/button.js";

function setup() {
  let canvas = createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);

  canvas.parent("game-div");

  canvas.class("quixo-canvas");

  pixelDensity(1);

  const gameDiv = document.getElementById("game-div");

  gameDiv.classList.add("hidden", "quixo-board-frame");

  const controller = new Controller();

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
  const controller = window.controller;

  if (!controller) return;

  controller.tick();

  RB.drawButton();
}

function mousePressed() {
  const controller = window.controller;

  if (!controller || !controller.board) return;

  RB.mousePressedButton();

  let clickedCell = controller.board.getHoveredCell();

  controller.cellClick(clickedCell);
}

// Ofertăm acces global funcțiilor p5 pentru ca librăria externă p5.js să le poată apela din modul

window.setup = setup;

window.draw = draw;

window.mousePressed = mousePressed;

fill("#b9783d");

stroke("#3a210f");

strokeWeight(4);

rect(x, y, cellSize, cellSize, 6);
