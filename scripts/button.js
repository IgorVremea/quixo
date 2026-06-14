import CONFIG from "../config.js";
import { Board } from "./Board.js";

// declarăm RB global, obiect - RESTART BUTTON
export const RB = {
  //setare initiala - scor
  scores: {
    x: 0,
    o: 0,
  },
  restartBtn: {
    x: CONFIG.canvas.width / 30,
    y: CONFIG.canvas.height / 10,
    w: CONFIG.canvas.width / 6,
    h: CONFIG.canvas.height / 15,
  },

  drawButton: function () {
    // scor

    let playerX = window.controller ? window.controller.players.x : "Player X";
    let playerO = window.controller ? window.controller.players.o : "Player O";

    // text responsive
    textSize(CONFIG.canvas.width / 35);

    // scor player X - stânga
    fill("#EC4899");
    textAlign(LEFT, CENTER);

    text(
      playerX + ": " + RB.scores.x,
      CONFIG.canvas.width / 30,
      CONFIG.canvas.height / 20,
    );

    // scor player O - dreapta
    fill("#3B82F6");
    textAlign(RIGHT, CENTER);

    text(
      playerO + ": " + RB.scores.o,
      CONFIG.canvas.width - CONFIG.canvas.width / 30,
      CONFIG.canvas.height / 20,
    );

    // buton restart
    fill(239, 68, 68);
    rect(RB.restartBtn.x, RB.restartBtn.y, RB.restartBtn.w, RB.restartBtn.h, 8);
    fill(255); // alb
    textSize(18);
    textAlign(CENTER, CENTER);
    text(
      "Restart",
      RB.restartBtn.x + RB.restartBtn.w / 2,
      RB.restartBtn.y + RB.restartBtn.h / 2,
    );
  },

  mousePressedButton: function () {
    // click restart
    if (
      mouseX > RB.restartBtn.x &&
      mouseX < RB.restartBtn.x + RB.restartBtn.w &&
      mouseY > RB.restartBtn.y &&
      mouseY < RB.restartBtn.y + RB.restartBtn.h
    ) {
      RB.scores.x = 0;
      RB.scores.o = 0;
      if (window.controller) {
        window.controller.board = new Board(); //eliberare tabla
        window.controller.isInChangeBoardMode = false; //sa nu creada controler ca e intr-o mutate
        window.controller.isChangedState = false;
        window.controller.activeCell = null;
        window.controller.currentSign = "x";
        window.controller.winnerText = "";
      }
      console.log("Jocul a fost resetat complet!");
    }
  },
};
