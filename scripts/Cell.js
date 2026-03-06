class Cell {
    constructor(cellSize, x, y, boardCoordX = undefined, boardCoordY = undefined, sign = '', isActive = true, type = undefined){
        this.cellSize = cellSize;
        this.x = x;
        this.y = y;
        this.boardCoordX = boardCoordX;
        this.boardCoordY = boardCoordY;
        this.sign = sign;
        this.isActive = isActive;
        this.type = type;
    }

    draw(hoverState = CONFIG.cell.states.NORMAL){
        if(this.isActive == true){
            strokeWeight(5);
            stroke(hoverState == CONFIG.cell.states.HOVER ? CONFIG.cell.borderColorHover : CONFIG.cell.borderColor);
            fill( ['↑', '↓', '→', '←'].includes(this.sign) ? CONFIG.cell.bgColorArrow : CONFIG.cell.bgColor);
            square(this.x, this.y, this.cellSize, 10);
            this.drawSign(this.sign);
        }
    }
    drawSign(sign){
        this.sign = sign;
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(CONFIG.cell.cellSize/1.5);
        switch(sign){
            case 'x':
                fill('#F00');
                text('x', (this.x + this.cellSize/2), (this.y + this.cellSize/2));
                break;
            case 'o':
                fill('#00F');
                text('o', (this.x + this.cellSize/2), (this.y + this.cellSize/2));
                break;
            case '↑':    // Altcode 24
            case '↓':    // Altcode 25
            case '→':    // Altcode 26
            case '←':    // Altcode 27
                fill('#FFF');
                text(sign, (this.x + this.cellSize/2), (this.y + this.cellSize/2));
                break;
            default:
                fill('rgb(135, 11, 133)');
                text(sign, (this.x + this.cellSize/2), (this.y + this.cellSize/2));
                break;
                
        }
    }
    isHover(mX, mY){
        if(mX >= this.x &&
            mX <= this.x + this.cellSize &&
            mY >= this.y &&
            mY <= this.y + this.cellSize
        ) {
            return true;
        }
        else {
            return false;
        }
    }
}