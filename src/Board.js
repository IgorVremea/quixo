class Board{
    constructor(cellSize){
        this.cellSize = cellSize;
        this.boardSize = cellSize*5;
    }

    draw(){
        fill(CONFIG.cell.bgColor);
        for(let y = 0; y<5; y++){
            for(let x = 0; x<5; x++){
                strokeWeight(5);
                stroke(CONFIG.canvas.bgColor);
                square((CONFIG.canvas.width-this.boardSize)/2+this.cellSize*x, (CONFIG.canvas.height-this.boardSize)/2+this.cellSize*y, this.cellSize, 10);
            }
        }
    }
}