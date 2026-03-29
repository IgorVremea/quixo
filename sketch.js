let controller;

function setup() {
  createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
  controller = new Controller(new Board());
  // apelare functia din botton.js care face butonul de restart si scorul sa apara pe ecran
  createUI();
}

function draw() {
  controller.tick();
}

function mousePressed() {
  let clickedCell = controller.board.getHoveredCell();
  controller.cellClick(clickedCell);
}
