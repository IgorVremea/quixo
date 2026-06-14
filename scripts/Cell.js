import CONFIG from "../config.js";

export class Cell {
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

  // Pentru a pastra border la cell selectat chiar daca nu este hover
  draw(hoverState = CONFIG.cell.states.NORMAL, isSelected = false) {
    if (!this.isActive) return;

    const isHover = hoverState === CONFIG.cell.states.HOVER || isSelected;
    const isArrow = ["↑", "↓", "→", "←"].includes(this.sign);

    push();

    // Umbra pentru efect de piesa/cub
    noStroke();
    fill("rgba(0, 0, 0, 0.35)");
    square(this.x + 4, this.y + 5, this.cellSize, 10);

    // Culori de lemn alternate pentru aspect natural
    const woodColors = ["#b9783d", "#a96632", "#c88749", "#8f5528"];
    const colorIndex =
      (Number(this.boardCoordX || 0) + Number(this.boardCoordY || 0)) %
      woodColors.length;

    // Pentru celulele cu sageti folosim o nuanta mai inchisa
    if (isArrow) {
      fill("#5a3318");
    } else {
      fill(woodColors[colorIndex]);
    }

    strokeWeight(isHover ? 6 : 4);
    stroke(isHover ? "#f2c94c" : "#3a210f");

    square(this.x, this.y, this.cellSize, 10);

    // Lumina subtila in partea de sus
    noStroke();
    fill("rgba(255, 238, 205, 0.22)");
    rect(
      this.x + 7,
      this.y + 7,
      this.cellSize - 14,
      Math.max(6, this.cellSize * 0.12),
      6,
    );

    // Textura fina de lemn
    stroke("rgba(255, 238, 205, 0.22)");
    strokeWeight(1);

    for (let k = 12; k < this.cellSize - 8; k += 14) {
      line(
        this.x + 9,
        this.y + k,
        this.x + this.cellSize - 9,
        this.y + k + sin((k + this.x + this.y) * 0.08) * 3,
      );
    }

    // Linii mai inchise pentru fibra lemnului
    stroke("rgba(58, 33, 15, 0.28)");
    strokeWeight(1);

    for (let k = 20; k < this.cellSize - 10; k += 24) {
      line(
        this.x + 10,
        this.y + k,
        this.x + this.cellSize - 12,
        this.y + k + cos((k + this.y) * 0.06) * 4,
      );
    }

    // Efect de selectie/hover
    if (isHover) {
      noFill();
      stroke("#fff1b8");
      strokeWeight(2);
      square(this.x + 5, this.y + 5, this.cellSize - 10, 7);
    }

    pop();

    this.drawSign(this.sign);
  }

  drawSign(sign) {
    this.sign = sign;

    const cx = this.x + this.cellSize / 2;
    const cy = this.y + this.cellSize / 2;

    push();

    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(this.cellSize / 1.55);

    switch (sign) {
      case "x":
        stroke("#3a210f");
        strokeWeight(5);
        fill("#f8ead2");
        text("X", cx, cy + 2);
        break;

      case "o":
        stroke("#3a210f");
        strokeWeight(5);
        fill("#f2c94c");
        text("O", cx, cy + 2);
        break;

      case "↑":
      case "↓":
      case "→":
      case "←":
        stroke("#2a170b");
        strokeWeight(4);
        fill("#fff1b8");
        text(sign, cx, cy + 1);
        break;

      default:
        if (sign) {
          stroke("#3a210f");
          strokeWeight(4);
          fill("#f8ead2");
          text(sign, cx, cy);
        }
        break;
    }

    pop();
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