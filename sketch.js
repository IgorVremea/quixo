let board;

function setup(){
    createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
    board = new Board(CONFIG.cell.cellSize);
    
}

function draw() {
    board.draw();
}