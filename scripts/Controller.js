class Controller {
    constructor(board){
        this.board = board;
        this.isInChangeBoardMode = false;
        this.isChangedState = false;
        this.activeCell = null;
        this.currentSign = 'x';
        this.players = {
            x: "Player X", 
            o: "Player O"
        };
        
    }
    getCurrentPlayerName() {
        return this.players[this.currentSign];
    }
    tick(){
    this.checkBtn();
    this.board.draw();

    textSize(20);
    textAlign(LEFT, CENTER);

    fill(255);
    text("Rândul:", CONFIG.canvas.width / 2 - 160, 30);

    let playerColor = this.currentSign === 'x' ? '#3B82F6' : '#EC4899';
    fill(playerColor);
    text(
        this.getCurrentPlayerName() + " (" + this.currentSign.toUpperCase() + ")",
        CONFIG.canvas.width / 2 - 80,
        30
    );
}
    changeBoardMode(cell){
        if(cell != undefined &&
            this.isInChangeBoardMode
            && this.isChangedState
            && cell.type == CONFIG.cell.type.PIECE
            && this.board.isCellOnEdge(cell.boardCoordX, cell.boardCoordY)){
            this.isChangedState = false;
            console.log(cell.boardCoordX + ' ' + cell.boardCoordY);
            this.board.board[cell.boardCoordX][0].isActive = cell.boardCoordY == 1 ? false : true;
            this.board.board[cell.boardCoordX][6].isActive = cell.boardCoordY == 5 ? false : true;
            this.board.board[0][cell.boardCoordY].isActive = cell.boardCoordX == 1 ? false : true;
            this.board.board[6][cell.boardCoordY].isActive = cell.boardCoordX == 5 ? false : true;
        } else {
            
        }
    }
    checkBtn(){
        
    }
    cellClick(cell, sign = this.currentSign){
        if (!cell) return;
        if(cell.type == CONFIG.cell.type.ARROW && cell.isActive && this.activeCell != null){
            this.isInChangeBoardMode = false;
            this.board.turnArrowsOff();
            let tempDir;
            switch(cell.sign){
                case '↑':    // Altcode 24
                    tempDir = CONFIG.board.direction.UP;
                    break;
                case '↓':    // Altcode 25
                    tempDir = CONFIG.board.direction.DOWN;
                    break;
                case '→':    // Altcode 26
                    tempDir = CONFIG.board.direction.RIGHT;
                    break;
                case '←':    // Altcode 27
                    tempDir = CONFIG.board.direction.LEFT;
                    break;
            }
            this.board.completeLine(tempDir, this.activeCell);
            this.activeCell = null;
            this.currentSign = this.currentSign == 'x' ? 'o' : 'x';
        }
        if(cell != null
            && this.board.isCellOnEdge(cell.boardCoordX, cell.boardCoordY)
            && cell.type == CONFIG.cell.type.PIECE
            && !this.isInChangeBoardMode
            && (cell.sign == '' || cell.sign == this.currentSign)) {
            this.isInChangeBoardMode = true;
            this.isChangedState = true;
            this.changeBoardMode(cell);
            if(sign == 'x' || sign == 'o'){
                cell.sign = sign;
                this.activeCell = cell;
            } else {
                cell.sign = '';
            }
        }
    }

}