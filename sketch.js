let controller;

function setup() {
  createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
  controller = new Controller(new Board());
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
