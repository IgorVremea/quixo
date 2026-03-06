class Controller {
    constructor(board){
        this.board = board;
    }

    setSignOnHoveredCell(cell, sign){
        if(cell != null && board.isCellOnEdge(cell.boardCoordX, cell.boardCoordY) && cell.type == CONFIG.cell.type.PIECE) {
            if(sign == 'x' || sign == 'o'){
                cell.sign = sign;
            } else {
                cell.sign = '';
            }
        }
    }
}