class Controller {
    constructor(board){
        this.board = board;
        this.isInChangeBoardMode = false;
        this.isChangedState = false;
    }
    tick(){
        this.checkBtn();
        this.board.draw();
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
    cellClick(cell, sign = null){
        if(cell.type == CONFIG.cell.type.ARROW && cell.isActive){
            this.isInChangeBoardMode = false;
            this.board.turnArrowsOff();
        }
        if(cell != null
            && this.board.isCellOnEdge(cell.boardCoordX, cell.boardCoordY)
            && cell.type == CONFIG.cell.type.PIECE
            && !this.isInChangeBoardMode
            && cell.sign == '') {
                this.isInChangeBoardMode = true;
                this.isChangedState = true;
                this.changeBoardMode(cell);
                if(sign == 'x' || sign == 'o'){
                    cell.sign = sign;
                } else {
                    cell.sign = '';
                }
        }
    }

}