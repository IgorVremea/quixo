class Cell {
    constructor(cellSize, x, y){
        this.cellSize = cellSize;
        this.x = x;
        this.y = y;
        // this.isHoverBool = false;
    }

    draw(){
        fill(CONFIG.cell.bgColor);
        strokeWeight(5);
        stroke(this.isHover() ? '#000' : CONFIG.canvas.bgColor);
        square(this.x, this.y, this.cellSize, 10);
    }

    isHover(){
        if(mouseX >= this.x &&
            mouseX <= this.x + this.cellSize &&
            mouseY >= this.y &&
            mouseY <= this.y + this.cellSize
        ) {
            return true;
        }
        else {
            return false;
        }
    }
}