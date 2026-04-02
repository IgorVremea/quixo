let score = 0; // seteaza initial scor la 0
let scoreElement;

let restartBtn = { x: 20, y: 60, w: 100, h: 40 };
let plusBtn = { x: 20, y: 120, w: 100, h: 40 };

function drawButton() {
  // 1. SCORUL
  fill(255); // culoare albă
  textSize(24);
  text("Scor: " + score, 20, 40);

  // 2. BUTON RESTART
  fill(239, 68, 68); // roșu
  rect(restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h, 8);
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(
    "Restart",
    restartBtn.x + restartBtn.w / 2,
    restartBtn.y + restartBtn.h / 2,
  );

  // 3. BUTON +1 (Test)
  fill(34, 197, 94); // verde
  rect(plusBtn.x, plusBtn.y, plusBtn.w, plusBtn.h, 8);
  fill(255);
  text(" +1 ", plusBtn.x + plusBtn.w / 2, plusBtn.y + plusBtn.h / 2);
}

// --- FUNCTII DE LOGICA ---

// scrie scorul "Scor:"
function mousePressedButton() {
  // click +1
  if (
    mouseX > plusBtn.x &&
    mouseX < plusBtn.x + plusBtn.w &&
    mouseY > plusBtn.y &&
    mouseY < plusBtn.y + plusBtn.h
  ) {
    score++;
  }

  // 1. Reset vizual

  if (
    mouseX > restartBtn.x &&
    mouseX < restartBtn.x + restartBtn.w &&
    mouseY > restartBtn.y &&
    mouseY < restartBtn.y + restartBtn.h
  ) {
    score = 0; //resetare scor
    // 2. Reset logică obiecte
    controller.board = new Board(); // Tablă nouă, curată

    // 3. Reset stări Controller (Siguranță)
    // Ne asigurăm că nu rămânem blocați în "ChangeBoardMode"
    // sa nu creada controller ca e in mijlocul unei mutari atunci cand se face restart
    controller.isInChangeBoardMode = false;
    controller.isChangedState = false;
    controller.activeCell = null;
    controller.currentSign = "x";

    console.log("Jocul a fost resetat complet!");
  }
}
