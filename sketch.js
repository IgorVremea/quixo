let controller;

function setup() {
  let canvas = createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
  canvas.parent('game-div');
  controller = new Controller();
  document.getElementById("game-div").classList.add("hidden");
}

function draw() {
  controller.tick();
  RB.drawButton();
}

function mousePressed() {
  RB.mousePressedButton();
  let clickedCell = controller.board.getHoveredCell();
  controller.cellClick(clickedCell);
}
