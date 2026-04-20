// declarăm RB global, obiect - RESTART BUTTON
RB = {
  score: 0, //setare initiala
  restartBtn: {
    x: CONFIG.canvas.width / 30,
    y: CONFIG.canvas.height / 10,
    w: CONFIG.canvas.width / 6,
    h: CONFIG.canvas.height / 15,
  },
  plusBtn: {
    x: CONFIG.canvas.width / 30,
    y: CONFIG.canvas.height / 5,
    w: CONFIG.canvas.width / 6,
    h: CONFIG.canvas.height / 15,
  },

  drawButton: function () {
    // scor
    fill(0); //negru
    textSize(24);
    text("Scor: " + RB.score, 70, CONFIG.canvas.height / 15);

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

    // buton +1
    fill(34, 197, 94);
    rect(RB.plusBtn.x, RB.plusBtn.y, RB.plusBtn.w, RB.plusBtn.h, 8);
    fill(255);
    text(
      "+1",
      RB.plusBtn.x + RB.plusBtn.w / 2,
      RB.plusBtn.y + RB.plusBtn.h / 2,
    );
  },

  mousePressedButton: function () {
    // click +1
    if (
      mouseX > RB.plusBtn.x &&
      mouseX < RB.plusBtn.x + RB.plusBtn.w &&
      mouseY > RB.plusBtn.y &&
      mouseY < RB.plusBtn.y + RB.plusBtn.h
    ) {
      RB.score++;
    }

    // click restart
    if (
      mouseX > RB.restartBtn.x &&
      mouseX < RB.restartBtn.x + RB.restartBtn.w &&
      mouseY > RB.restartBtn.y &&
      mouseY < RB.restartBtn.y + RB.restartBtn.h
    ) {
      RB.score = 0;
      if (controller) {
        controller.board = new Board(); //leiberare tabla
        controller.isInChangeBoardMode = false; //sa nu creada controler ca e intr-o mutate
        controller.isChangedState = false;
        controller.activeCell = null;
        controller.currentSign = "x";
      }
      console.log("Jocul a fost resetat complet!");
    }
  },
};
