let score = 0;
let scoreElement;

// seteaza initial scor la 0
function createUI() {
  // 1. SCORUL
  // createP - afiseaza text ca si <p></p>
  scoreElement = createP("Scor: 0");
  scoreElement.id("score");
  scoreElement.class(
    "absolute top-4 left-4 text-white text-2xl z-50 font-bold m-0",
  );

  // 2. BUTON RESTART
  let restartBtn = createButton("Restart");
  restartBtn.class(`
    absolute top-16 left-4 
    bg-red-500 hover:bg-red-600
    text-white font-bold py-2 px-4 
    rounded shadow z-50
    transition duration-200
  `);
  restartBtn.mousePressed(restartGame);

  // 3. BUTON +1 (Test)
  let plusBtn = createButton("+1");
  plusBtn.class(`
    absolute top-28 left-4
    bg-green-500 hover:bg-green-600
    text-white font-bold py-2 px-4
    rounded shadow z-50
    transition duration-200
  `);
  plusBtn.mousePressed(increaseScore);
}

// --- FUNCTII DE LOGICA ---

// scrie scorul "Scor:"
function increaseScore() {
  score++;
  scoreElement.html("Scor: " + score);
}

function restartGame() {
  // 1. Reset vizual
  score = 0;
  scoreElement.html("Scor: 0");

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
