let controller;

function setup() {
  createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
  controller = new Controller(new Board());
  createUI();
}

function draw() {
  controller.tick();
}

function mousePressed() {
  let clickedCell = controller.board.getHoveredCell();
  controller.cellClick(clickedCell);
}
