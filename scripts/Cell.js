class Cell {
  constructor(
    cellSize,
    x,
    y,
    boardCoordX = undefined,
    boardCoordY = undefined,
    sign = "",
    isActive = true,
    type = undefined,
  ) {
    this.cellSize = cellSize;
    this.x = x;
    this.y = y;

    this.boardCoordX = boardCoordX;
    this.boardCoordY = boardCoordY;

    this.sign = sign;
    this.isActive = isActive;
    this.type = type;
  }

  draw(hoverState = CONFIG.cell.states.NORMAL) {
    if (!this.isActive) return;

    strokeWeight(5);

    stroke(
      hoverState === CONFIG.cell.states.HOVER
        ? CONFIG.cell.borderColorHover
        : CONFIG.cell.borderColor,
    );

    fill(
      ["↑", "↓", "→", "←"].includes(this.sign)
        ? CONFIG.cell.bgColorArrow
        : CONFIG.cell.bgColor,
    );

    square(this.x, this.y, this.cellSize, 10);

    this.drawSign(this.sign);
  }

  drawSign(sign) {
    this.sign = sign;

    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.cellSize / 1.5);

    const cx = this.x + this.cellSize / 2;
    const cy = this.y + this.cellSize / 2;

    switch (sign) {
      case "x":
        fill("#F00");
        text("x", cx, cy);
        break;

      case "o":
        fill("#00F");
        text("o", cx, cy);
        break;

      case "↑":
      case "↓":
      case "→":
      case "←":
        fill("#FFF");
        text(sign, cx, cy);
        break;

      default:
        fill("rgb(135, 11, 133)");
        text(sign, cx, cy);
        break;
    }
  }

  isHover(mX, mY) {
    return (
      mX >= this.x &&
      mX <= this.x + this.cellSize &&
      mY >= this.y &&
      mY <= this.y + this.cellSize
    );
  }
}
