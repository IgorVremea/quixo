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

  soundEnabled: true,
  isPaused: false,

  optionsBtn: {
    x: 15,
    y: CONFIG.canvas.height - 65,
    w: 50,
    h: 50,
  },

  isRulesOpen: false,

  rulesBtn: {
    x: 15,
    y: CONFIG.canvas.height - 115,
    w: 50,
    h: 50,
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

  drawSettingsIcon: function (btn) {
    const isHovered = RB.isMouseInside(btn);

    push();

    noStroke();
    fill("rgba(0, 0, 0, 0.38)");
    rect(btn.x + 3, btn.y + 5, btn.w, btn.h, 8);

    stroke(isHovered ? "#fff1b8" : "#3a210f");
    strokeWeight(isHovered ? 3 : 2);
    fill(isHovered ? "#fff1b8" : "#c89152");
    rect(btn.x, btn.y, btn.w, btn.h, 8);

    noStroke();
    fill("#7a4a24");
    rect(btn.x + 2, btn.y + btn.h * 0.62, btn.w - 4, btn.h * 0.28, 6);

    fill("rgba(255, 255, 255, 0.2)");
    rect(btn.x + 5, btn.y + 4, btn.w - 10, btn.h * 0.25, 5);

    // Draw gear icon
    stroke("#2a170b");
    strokeWeight(1.5);
    fill("#2a170b");
    const iconX = btn.x + btn.w / 2;
    const iconY = btn.y + btn.h / 2;
    const gearSize = btn.w / 4;

    // Center circle
    circle(iconX, iconY, gearSize / 2);

    // Gear teeth
    for (let i = 0; i < 8; i++) {
      const angle = (TWO_PI / 8) * i;
      const x1 = iconX + cos(angle) * gearSize * 0.6;
      const y1 = iconY + sin(angle) * gearSize * 0.6;
      const x2 = iconX + cos(angle) * gearSize * 0.85;
      const y2 = iconY + sin(angle) * gearSize * 0.85;
      line(x1, y1, x2, y2);
    }

    pop();
  },

  drawRulesIcon: function (btn) {
    const isHovered = RB.isMouseInside(btn);

    push();

    noStroke();
    fill("rgba(0, 0, 0, 0.38)");
    rect(btn.x + 3, btn.y + 5, btn.w, btn.h, 8);

    stroke(isHovered ? "#fff1b8" : "#3a210f");
    strokeWeight(isHovered ? 3 : 2);
    fill(isHovered ? "#fff1b8" : "#c89152");
    rect(btn.x, btn.y, btn.w, btn.h, 8);

    noStroke();
    fill("#7a4a24");
    rect(btn.x + 2, btn.y + btn.h * 0.62, btn.w - 4, btn.h * 0.28, 6);

    fill("rgba(255, 255, 255, 0.2)");
    rect(btn.x + 5, btn.y + 4, btn.w - 10, btn.h * 0.25, 5);

    // Draw book/rules icon
    stroke("#2a170b");
    strokeWeight(1.2);
    const iconX = btn.x + btn.w / 2;
    const iconY = btn.y + btn.h / 2;
    const bookW = btn.w / 3.5;
    const bookH = btn.h / 2.2;

    // Book outline
    noFill();
    rect(iconX - bookW / 2, iconY - bookH / 2, bookW, bookH, 2);

    // Lines representing text
    stroke("#2a170b");
    strokeWeight(1);
    line(iconX - bookW / 3, iconY - bookH / 4, iconX + bookW / 3, iconY - bookH / 4);
    line(iconX - bookW / 3, iconY, iconX + bookW / 3, iconY);
    line(iconX - bookW / 3, iconY + bookH / 4, iconX + bookW / 3, iconY + bookH / 4);

    pop();
  },

  playSound: function (type = "click") {
    if (!RB.soundEnabled) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "win") {
      oscillator.frequency.value = 660;
      gain.gain.value = 0.08;
    } else if (type === "error") {
      oscillator.frequency.value = 180;
      gain.gain.value = 0.06;
    } else {
      oscillator.frequency.value = 420;
      gain.gain.value = 0.05;
    }

    oscillator.type = "sine";
    oscillator.start();

    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
    oscillator.stop(audioCtx.currentTime + 0.12);
  },

  drawPauseMenu: function () {
    if (!RB.isPaused) return;

    push();

    fill("rgba(0, 0, 0, 0.55)");
    noStroke();
    rect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    const boxW = CONFIG.canvas.width / 2;
    const boxH = CONFIG.canvas.height / 2.6;
    const boxX = CONFIG.canvas.width / 2 - boxW / 2;
    const boxY = CONFIG.canvas.height / 2 - boxH / 2;

    fill("#3a210f");
    stroke("#f2c94c");
    strokeWeight(4);
    rect(boxX, boxY, boxW, boxH, 12);

    fill("#fff1c7");
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(28);
    text("Optiuni", CONFIG.canvas.width / 2, boxY + 45);

    RB.continueBtn = {
      x: boxX + boxW / 2 - 110,
      y: boxY + 90,
      w: 220,
      h: 48,
    };

    RB.soundBtn = {
      x: boxX + boxW / 2 - 110,
      y: boxY + 150,
      w: 220,
      h: 48,
    };

    RB.menuRestartBtn = {
      x: boxX + boxW / 2 - 110,
      y: boxY + 210,
      w: 220,
      h: 48,
    };

    RB.drawWoodButton(RB.continueBtn, "Continua");
    RB.drawWoodButton(
      RB.soundBtn,
      RB.soundEnabled ? "Sunet: ON" : "Sunet: OFF",
    );
    RB.drawWoodButton(RB.menuRestartBtn, "Restart");

    pop();
  },

  drawRulesMenu: function () {
    if (!RB.isRulesOpen) return;

    push();

    fill("rgba(0, 0, 0, 0.58)");
    noStroke();
    rect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    const boxW = CONFIG.canvas.width / 1.55;
    const boxH = CONFIG.canvas.height / 1.9;
    const boxX = CONFIG.canvas.width / 2 - boxW / 2;
    const boxY = CONFIG.canvas.height / 2 - boxH / 2;

    fill("#3a210f");
    stroke("#f2c94c");
    strokeWeight(4);
    rect(boxX, boxY, boxW, boxH, 12);

    fill("#fff1c7");
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(26);
    text("Reguli Quixo", CONFIG.canvas.width / 2, boxY + 42);

    fill("#f8ead2");
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(16);

    const rulesText =
      "1. Jocul se joaca pe o tabla de 5 x 5.\n" +
      "2. La randul tau alegi un cub de pe margine.\n" +
      "3. Poti alege un cub gol sau un cub cu simbolul tau.\n" +
      "4. Cubul ales se impinge inapoi pe tabla dintr-o directie valida.\n" +
      "5. Scopul este sa faci 5 simboluri la rand: orizontal, vertical sau diagonal.\n" +
      "6. Dupa fiecare runda, jucatorii schimba X si O intre ei.";

    text(rulesText, boxX + 38, boxY + 88, boxW - 76, boxH - 150);

    RB.closeRulesBtn = {
      x: CONFIG.canvas.width / 2 - 95,
      y: boxY + boxH - 72,
      w: 190,
      h: 46,
    };

    RB.drawWoodButton(RB.closeRulesBtn, "Inchide");

    pop();
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

  resetBoardOnly: function (shouldSwapPlayers = false) {
    if (window.controller) {
      if (shouldSwapPlayers) {
        RB.swapPlayersAndScores();
      }

      window.controller.board = new Board();
      window.controller.isInChangeBoardMode = false;
      window.controller.isChangedState = false;
      window.controller.activeCell = null;
      // Turn de început va fi tratat de Controller în funcție de opțiunea de inversare roles.
      // Nu forțăm aici currentSign la "x".
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

    RB.drawRulesIcon(RB.rulesBtn);
    RB.drawSettingsIcon(RB.optionsBtn);

    RB.drawWinnerButton();
    RB.drawPauseMenu();
    RB.drawRulesMenu();
  },

 mousePressedButton: function () {
  // daca meniul de reguli este deschis
  if (RB.isRulesOpen) {
    if (RB.closeRulesBtn && RB.isMouseInside(RB.closeRulesBtn)) {
      RB.playSound("click");
      RB.isRulesOpen = false;
      return;
    }

    return;
  }

  // daca meniul de pauza/optiuni este deschis
  if (RB.isPaused) {
    if (RB.continueBtn && RB.isMouseInside(RB.continueBtn)) {
      RB.playSound("click");
      RB.isPaused = false;
      return;
    }

    if (RB.soundBtn && RB.isMouseInside(RB.soundBtn)) {
      RB.soundEnabled = !RB.soundEnabled;
      RB.playSound("click");
      return;
    }

    if (RB.menuRestartBtn && RB.isMouseInside(RB.menuRestartBtn)) {
      RB.playSound("click");
      RB.isPaused = false;
      RB.resetFullGame();
      return;
    }

    return;
  }

  // butonul de dupa castig: Joaca din nou
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
      RB.playSound("click");
      RB.resetBoardOnly(true);
      console.log("Runda noua: jucatorii au fost inversati.");
      if (window.controller && window.controller.swapRolesForRound) {
        window.controller.swapRolesForRound();
      }
      return;
    }

    return;
  }

  // buton optiuni
  if (RB.isMouseInside(RB.optionsBtn)) {
    RB.playSound("click");
    RB.isPaused = true;
    return;
  }

  // buton reguli
  if (RB.isMouseInside(RB.rulesBtn)) {
    RB.playSound("click");
    RB.isRulesOpen = true;
    return;
  }

  // buton restart
if (RB.isMouseInside(RB.restartBtn)) {
  RB.playSound("click");
  RB.resetFullGame();
  return;
}

},

swapPlayersAndScores: function () {
  if (!window.controller) return;

  const oldPlayerX = window.controller.players.x;
  window.controller.players.x = window.controller.players.o;
  window.controller.players.o = oldPlayerX;

  const oldScoreX = RB.scores.x;
  RB.scores.x = RB.scores.o;
  RB.scores.o = oldScoreX;
}

};