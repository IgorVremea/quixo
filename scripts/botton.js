// declarăm UI global
UI = {
  score: 0, //setare initiala
  restartBtn: { x: 20, y: 60, w: 100, h: 40 },
  plusBtn: { x: 20, y: 120, w: 100, h: 40 },

  drawButton: function () {
    // scor
    fill(0); //negru
    textSize(24);
    text("Scor: " + UI.score, 70, 40);

    // buton restart
    fill(239, 68, 68);
    rect(UI.restartBtn.x, UI.restartBtn.y, UI.restartBtn.w, UI.restartBtn.h, 8);
    fill(255); // alb
    textSize(18);
    textAlign(CENTER, CENTER);
    text(
      "Restart",
      UI.restartBtn.x + UI.restartBtn.w / 2,
      UI.restartBtn.y + UI.restartBtn.h / 2,
    );

    // buton +1
    fill(34, 197, 94);
    rect(UI.plusBtn.x, UI.plusBtn.y, UI.plusBtn.w, UI.plusBtn.h, 8);
    fill(255);
    text(
      "+1",
      UI.plusBtn.x + UI.plusBtn.w / 2,
      UI.plusBtn.y + UI.plusBtn.h / 2,
    );
  },

  mousePressedButton: function () {
    // click +1
    if (
      mouseX > UI.plusBtn.x &&
      mouseX < UI.plusBtn.x + UI.plusBtn.w &&
      mouseY > UI.plusBtn.y &&
      mouseY < UI.plusBtn.y + UI.plusBtn.h
    ) {
      UI.score++;
    }

    // click restart
    if (
      mouseX > UI.restartBtn.x &&
      mouseX < UI.restartBtn.x + UI.restartBtn.w &&
      mouseY > UI.restartBtn.y &&
      mouseY < UI.restartBtn.y + UI.restartBtn.h
    ) {
      UI.score = 0;
      if (controller) {
        controller.board = new Board();
        controller.isInChangeBoardMode = false;
        controller.isChangedState = false;
        controller.activeCell = null;
        controller.currentSign = "x";
      }
      console.log("Jocul a fost resetat complet!");
    }
  },
};
