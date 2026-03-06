class Board{
    constructor(cellSize){
        this.cellSize = cellSize;
        this.boardSize = cellSize*7;
        this.board = [];
        this.boardInit();
        this.x = this.board[0][0].x;
        this.y = this.board[0][0].y;
    }
    boardInit(){
        let signTemp;
        let isActive;
        let typeTemp;
        for(let y = 0; y<7; y++){
            let row = []
            for(let x = 0; x<7; x++){
                switch(CONFIG.board.boardScheme[y][x]){
                    case 'xo':
                        signTemp = '';
                        isActive = true;
                        typeTemp = CONFIG.cell.type.PIECE;
                        break;
                    case '/':
                        signTemp = '';
                        isActive = false;
                        typeTemp = CONFIG.cell.type.EDGE;
                        break;
                    case '↑':    // Altcode 24
                    case '↓':    // Altcode 25
                    case '→':    // Altcode 26
                    case '←':    // Altcode 27
                        signTemp = CONFIG.board.boardScheme[y][x];
                        isActive = false;
                        typeTemp = CONFIG.cell.type.ARROW;
                        break;
                    default:
                        signTemp = '';
                        isActive = false;
                        typeTemp = undefined;                        
                }
                row.push( new Cell(this.cellSize, (CONFIG.canvas.width-this.boardSize)/2+this.cellSize*x, (CONFIG.canvas.height-this.boardSize)/2+this.cellSize*y, x, y, signTemp, isActive, typeTemp) );
            }
            this.board.push(row);
        }
    }
    draw(){
        background(CONFIG.canvas.bgColor);
        let hoverX;
        let hoverY;
        for(let y = 0; y<7; y++){                                       // Desenez teren
            for(let x = 0; x<7; x++){
                this.board[x][y].draw();
                if(this.board[x][y].isHover(mouseX, mouseY)) {
                    hoverX = x;
                    hoverY = y;
                }
            }
        }
        if(this.isCellOnEdge(hoverX, hoverY)) {
                this.board[hoverX][hoverY].draw(CONFIG.cell.states.HOVER); 
            }
    }
    getHoveredCell(){
        for(let y = 0; y<7; y++){
            for(let x = 0; x<7; x++){
                if(this.board[x][y].isHover(mouseX, mouseY)) {
                    return this.board[x][y];
                }
            }
        }
        return null;
    }
    isCellOnEdge(x, y){
        if ((x != undefined && y != undefined) &&
            (x <= 1 ||  x >= 5 || y <= 1 || y >= 5)){
                return true;
            } else {
                return false
            }
    }
}