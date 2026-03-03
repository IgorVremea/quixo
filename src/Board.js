class Board{
    constructor(cellSize){
        this.cellSize = cellSize;
        this.boardSize = cellSize*5;
        this.board = [];
        for(let y = 0; y<5; y++){           // Initializarea terenului
            let row = [];
            for(let x = 0; x<5; x++){
                row.push( new Cell(this.cellSize, (CONFIG.canvas.width-this.boardSize)/2+this.cellSize*x, (CONFIG.canvas.height-this.boardSize)/2+this.cellSize*y) );
            }
            this.board.push(row);
        }
        this.x = this.board[0][0].x;
        this.y = this.board[0][0].y;
    }

    draw(){
        background(CONFIG.canvas.bgColor);
        let hoverX;
        let hoverY;
        for(let y = 0; y<5; y++){                                       // Desenez teren
            for(let x = 0; x<5; x++){
                this.board[x][y].draw();
                if(mouseX >= this.x &&                          // Cursor trebuie sa fie pe teren in momentul verificarii
                    mouseX <= this.x + this.boardSize &&
                    mouseY >= this.y &&
                    mouseY <= this.y + this.boardSize
                    ){
                    if(this.board[x][y].isHover()) {
                        hoverX = x;
                        hoverY = y;
                    }  
                }
            }
        }
        if((hoverX != undefined && hoverY != undefined) &&              // Evedentiez celula pe care este mouse
            (hoverX < 1 ||  hoverX > 3 || hoverY < 1 || hoverY > 3)
            ) this.board[hoverX][hoverY].draw(HOVER); 
    }
}