import CONFIG from "../config.js";
import { Board } from "./Board.js";

export const RB = {
  scores: {
    x: 0,
    o: 0,
  },

  restartBtn: {
    x: CONFIG.canvas.width / 2 - CONFIG.canvas.width / 5,
    y: CONFIG.canvas.height - CONFIG.canvas.height / 7.2,
    w: CONFIG.canvas.width / 2.5,
    h: CONFIG.canvas.height / 11,
  },

  playAgainBtn: {
    x: CONFIG.canvas.width / 2 - CONFIG.canvas.width / 6,
    y: CONFIG.canvas.height - CONFIG.canvas.height / 8,
    w: CONFIG.canvas.width / 3,
    h: CONFIG.canvas.height / 13,
  },

  isMouseInside: function (btn) {
    return (
      mouseX > btn.x &&
      mouseX < btn.x + btn.w &&
      mouseY > btn.y &&
      mouseY < btn.y + btn.h
    );
  },

  fitText: function (label, maxWidth, startSize, minSize = 8) {
    let size = startSize;
    textSize(size);

    while (textWidth(label) > maxWidth && size > minSize) {
      size -= 1;
      textSize(size);
    }

    return size;
  },

  drawHudBackground: function () {
    push();

    noStroke();
    fill("#2a170b");
    rect(
      CONFIG.canvas.width / 40,
      CONFIG.canvas.height / 55,
      CONFIG.canvas.width - CONFIG.canvas.width / 20,
      CONFIG.canvas.height / 8,
      8,
    );

    fill("rgba(255, 238, 205, 0.08)");
    rect(
      CONFIG.canvas.width / 30,
      CONFIG.canvas.height / 45,
      CONFIG.canvas.width - CONFIG.canvas.width / 15,
      CONFIG.canvas.height / 35,
      6,
    );

    pop();
  },

  drawWoodButton: function (btn, label, options = {}) {
    const isHovered = RB.isMouseInside(btn);

    const topColor = options.topColor || "#fff1b8";
    const middleColor = options.middleColor || "#f2c94c";
    const bottomColor = options.bottomColor || "#b97820";
    const textColor = options.textColor || "#2a170b";

    push();

    noStroke();
    fill("rgba(0, 0, 0, 0.38)");
    rect(btn.x + 5, btn.y + 7, btn.w, btn.h, 10);

    stroke(isHovered ? "#fff1b8" : "#3a210f");
    strokeWeight(isHovered ? 4 : 3);
    fill(isHovered ? topColor : middleColor);
    rect(btn.x, btn.y, btn.w, btn.h, 10);

    noStroke();
    fill(bottomColor);
    rect(btn.x + 3, btn.y + btn.h * 0.62, btn.w - 6, btn.h * 0.28, 7);

    fill("rgba(255, 255, 255, 0.28)");
    rect(btn.x + 8, btn.y + 7, btn.w - 16, btn.h * 0.28, 7);

    stroke("rgba(58, 33, 15, 0.22)");
    strokeWeight(1);
    for (let i = 14; i < btn.w - 10; i += 18) {
      line(btn.x + i, btn.y + 9, btn.x + i + 8, btn.y + btn.h - 9);
    }

    noStroke();
    fill(textColor);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(Math.max(18, CONFIG.canvas.width / 34));
    text(label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 1);

    pop();
  },

  drawScoreCard: function (x, y, w, h, playerName, score, symbol, alignRight = false) {
    push();

    const scoreText = playerName + ": " + score;

    noStroke();
    fill("rgba(0, 0, 0, 0.35)");
    rect(x + 4, y + 5, w, h, 8);

    stroke("#3a210f");
    strokeWeight(3);
    fill("#5a3318");
    rect(x, y, w, h, 8);

    noStroke();
    fill("rgba(255, 238, 205, 0.18)");
    rect(x + 6, y + 6, w - 12, h * 0.3, 6);

    fill("#d8b985");
    textStyle(BOLD);
    textAlign(alignRight ? RIGHT : LEFT, CENTER);
    textSize(8);
    text(
      symbol === "X" ? "JUCATOR X" : "JUCATOR O",
      alignRight ? x + w - 10 : x + 10,
      y + h * 0.3,
    );

    fill("#fff1c7");
    textStyle(BOLD);
    RB.fitText(scoreText, w - 20, 13, 8);
    text(scoreText, alignRight ? x + w - 10 : x + 10, y + h * 0.67);

    pop();
  },

  drawTurnCard: function () {
    if (!window.controller) return;

    const currentSign = window.controller.currentSign || "x";
    const playerName =
      currentSign === "x"
        ? window.controller.players.x
        : window.controller.players.o;

    const cardW = CONFIG.canvas.width / 4.4;
    const cardH = CONFIG.canvas.height / 13.5;
    const cardX = CONFIG.canvas.width / 2 - cardW / 2;
    const cardY = CONFIG.canvas.height / 35;

    push();

    noStroke();
    fill("rgba(0, 0, 0, 0.35)");
    rect(cardX + 5, cardY + 7, cardW, cardH, 8);

    stroke("#f2c94c");
    strokeWeight(3);
    fill("#3a210f");
    rect(cardX, cardY, cardW, cardH, 8);

    noStroke();
    fill("rgba(255, 238, 205, 0.14)");
    rect(cardX + 7, cardY + 7, cardW - 14, cardH * 0.3, 6);

    fill("#d8b985");
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    textSize(10);
    text("RANDUL CURENT", cardX + cardW / 2, cardY + cardH * 0.28);

    fill("#fff1c7");
    textStyle(BOLD);
    textSize(16);
    text(playerName, cardX + cardW / 2, cardY + cardH * 0.66);

    pop();
  },

  drawWinnerButton: function () {
  if (!window.controller || !window.controller.winnerText) return;

    const overlayW = CONFIG.canvas.width / 1.7;
    const overlayH = CONFIG.canvas.height / 4.2;
    const overlayX = CONFIG.canvas.width / 2 - overlayW / 2;
    const overlayY = CONFIG.canvas.height / 2 - overlayH / 2;

    push();

    noStroke();
    fill("rgba(0, 0, 0, 0.45)");
    rect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    fill("rgba(0, 0, 0, 0.45)");
    rect(overlayX + 8, overlayY + 10, overlayW, overlayH, 12);

    stroke("#f2c94c");
    strokeWeight(4);
    fill("#3a210f");
    rect(overlayX, overlayY, overlayW, overlayH, 12);

    noStroke();
    fill("rgba(255, 238, 205, 0.16)");
    rect(overlayX + 12, overlayY + 12, overlayW - 24, overlayH * 0.18, 8);

    fill("#d8b985");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(Math.max(12, CONFIG.canvas.width / 55));
    text("CASTIGATOR", CONFIG.canvas.width / 2, overlayY + overlayH * 0.24);

    fill("#fff1c7");
    textStyle(BOLD);
    textSize(Math.max(22, CONFIG.canvas.width / 28));
    text(
      window.controller.winnerText,
      CONFIG.canvas.width / 2,
      overlayY + overlayH * 0.52,
    );

    const oldBtn = { ...RB.playAgainBtn };

    RB.playAgainBtn.x = CONFIG.canvas.width / 2 - overlayW / 4;
    RB.playAgainBtn.y = overlayY + overlayH * 0.68;
    RB.playAgainBtn.w = overlayW / 2;
    RB.playAgainBtn.h = overlayH / 4.5;

    RB.drawWoodButton(RB.playAgainBtn, "Joaca din nou", {
      topColor: "#fff1b8",
      middleColor: "#f2c94c",
      bottomColor: "#b97820",
      textColor: "#2a170b",
    });

    RB.playAgainBtn = oldBtn;

    pop();
  },

  resetBoardOnly: function () {
    if (window.controller) {
      window.controller.board = new Board();
      window.controller.isInChangeBoardMode = false;
      window.controller.isChangedState = false;
      window.controller.activeCell = null;
      window.controller.currentSign = "x";
      window.controller.winnerText = "";
    }
  },

  resetFullGame: function () {
    RB.scores.x = 0;
    RB.scores.o = 0;
    RB.resetBoardOnly();
    console.log("Jocul a fost resetat complet!");
  },

  drawButton: function () {
    RB.drawHudBackground();

    const playerX = window.controller ? window.controller.players.x : "Player X";
    const playerO = window.controller ? window.controller.players.o : "Player O";

    const cardW = CONFIG.canvas.width / 4.4;
    const cardH = CONFIG.canvas.height / 13.5;
    const cardY = CONFIG.canvas.height / 35;

    RB.drawScoreCard(
      CONFIG.canvas.width / 30,
      cardY,
      cardW,
      cardH,
      playerX,
      RB.scores.x,
      "X",
      false,
    );

    RB.drawScoreCard(
      CONFIG.canvas.width - CONFIG.canvas.width / 30 - cardW,
      cardY,
      cardW,
      cardH,
      playerO,
      RB.scores.o,
      "O",
      true,
    );

    RB.drawTurnCard();

    RB.drawWoodButton(RB.restartBtn, "Restart", {
      topColor: "#fff1b8",
      middleColor: "#f2c94c",
      bottomColor: "#b97820",
      textColor: "#2a170b",
    });

    RB.drawWinnerButton();
  },

  mousePressedButton: function () {
    if (RB.isMouseInside(RB.restartBtn)) {
      RB.resetFullGame();
    }

  if (window.controller && window.controller.winnerText) {
      const overlayW = CONFIG.canvas.width / 1.7;
      const overlayH = CONFIG.canvas.height / 4.2;
      const overlayY = CONFIG.canvas.height / 2 - overlayH / 2;

      const playAgainBtn = {
        x: CONFIG.canvas.width / 2 - overlayW / 4,
        y: overlayY + overlayH * 0.68,
        w: overlayW / 2,
        h: overlayH / 4.5,
      };

      if (RB.isMouseInside(playAgainBtn)) {
        RB.resetBoardOnly();
      }
    }

    if (
      window.controller &&
      window.controller.winnerText &&
      RB.isMouseInside(RB.playAgainBtn)
    ) {
      RB.resetBoardOnly();
      console.log("A inceput o runda noua!");
    }
  },
};
