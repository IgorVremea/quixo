let board;

function setup(){
    createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
    board = new Board(CONFIG.cell.cellSize);
    
}

function draw() {
    board.draw();
}

function mousePressed(){
    let clickedCell = board.getClickedCell();
    if(clickedCell != null) clickedCell.sign = 'x'; // TODO: Sa continui de facut proces de schimbare a terenului
}