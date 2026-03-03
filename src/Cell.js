class Cell {
    constructor(cellSize, x, y){
        this.cellSize = cellSize;
        this.x = x;
        this.y = y;
        this.sign = '';
    }

    draw(hoverState = NORMAL){
        strokeWeight(5);
        stroke(hoverState == HOVER ? CONFIG.cell.borderColorHover : CONFIG.cell.borderColor);
        fill(CONFIG.cell.bgColor);
        square(this.x, this.y, this.cellSize, 10);
        this.setSign(this.sign);
    }
    setSign(sign){
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
            default:
                
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