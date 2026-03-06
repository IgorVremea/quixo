let board;
let controller;

function setup(){
    createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
    board = new Board(CONFIG.cell.cellSize);
    controller = new Controller(board);
}

function draw() {
    board.draw();
}

function mousePressed(){
    let clickedCell = board.getHoveredCell();
    controller.setSignOnHoveredCell(clickedCell, 'x');
}