let controller;
function setup(){
    // createCanvas(CONFIG.canvas.width, CONFIG.canvas.height); // old
    controller = new Controller(new Board());
    const canvas = createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
    canvas.parent('game_parent');
}

function draw() {
    controller.tick();
}

function mousePressed(){
    let clickedCell = controller.board.getHoveredCell();
    controller.cellClick(clickedCell);
}