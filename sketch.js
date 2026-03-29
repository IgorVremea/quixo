let controller;

function setup() {
  createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
  controller = new Controller(new Board());
}

function draw() {
  controller.tick();
  createUI();
}

function mousePressed() {
  let clickedCell = controller.board.getHoveredCell();
  controller.cellClick(clickedCell);
}
