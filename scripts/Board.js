import CONFIG from "../config.js";
import { Cell } from "./Cell.js";

export class Board {
  constructor() {
    this.cellSize = CONFIG.cell.cellSize;
    this.boardSize = this.cellSize * 7;
    this.board = [];
    this.animations = []; // animatie pentru miscare cell selected
    this.boardInit();
    this.x = this.board[0][0].x;
    this.y = this.board[0][0].y;
  }
  boardInit() {
    let signTemp;
    let isActive;
    let typeTemp;
    for (let x = 0; x < 7; x++) {
      let row = [];
      for (let y = 0; y < 7; y++) {
        switch (CONFIG.board.boardScheme[y][x]) {
          case "xo":
            signTemp = "";
            isActive = true;
            typeTemp = CONFIG.cell.type.PIECE;
            break;
          case "E":
            signTemp = "";
            isActive = false;
            typeTemp = CONFIG.cell.type.EDGE;
            break;
          case "↑": // Altcode 24
          case "↓": // Altcode 25
          case "→": // Altcode 26
          case "←": // Altcode 27
            signTemp = CONFIG.board.boardScheme[y][x];
            isActive = false;
            typeTemp = CONFIG.cell.type.ARROW;
            break;
          default:
            signTemp = "";
            isActive = false;
            typeTemp = undefined;
        }
        row.push(
          new Cell(
            this.cellSize,
            (CONFIG.canvas.width - this.boardSize) / 2 + this.cellSize * x,
            (CONFIG.canvas.height - this.boardSize) / 2 + this.cellSize * y,
            x,
            y,
            signTemp,
            isActive,
            typeTemp,
          ),
        );
      }
      this.board.push(row);
    }
  }
  draw() {
    background(CONFIG.canvas.bgColor);

    let hoveredCell = null;
    // celula pe care am selectat-o sa ramana cu bordura chiar daca nu mai e hover
    // desen normal pentru toate celulele
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        let currentCell = this.board[x][y];

        currentCell.draw();

        if (currentCell.isHover(mouseX, mouseY)) {
          hoveredCell = currentCell;
        }
      }
    }

    // desenăm SELECTED peste toate
    if (controller.activeCell) {
      controller.activeCell.draw(CONFIG.cell.states.HOVER);
    }

    // desenăm HOVER peste toate
    if (
      hoveredCell &&
      this.isCellOnEdge(hoveredCell.boardCoordX, hoveredCell.boardCoordY)
    ) {
      hoveredCell.draw(CONFIG.cell.states.HOVER);
    }
    this.drawAnimations();
  }
  getHoveredCell() {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (this.board[x][y].isHover(mouseX, mouseY)) {
          return this.board[x][y];
        }
      }
    }
    return null;
  }
  turnArrowsOff() {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (this.board[x][y].type == CONFIG.cell.type.ARROW)
          this.board[x][y].isActive = false;
      }
    }
  }
  isCellOnEdge(x, y) {
    if (
      x != undefined &&
      y != undefined &&
      (x <= 1 || x >= 5 || y <= 1 || y >= 5)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // animation pentru cell selected
  drawAnimations() {
    for (let anim of this.animations) {
      let progress = (millis() - anim.startTime) / anim.duration;

      progress = constrain(progress, 0, 1);

      let x = lerp(anim.fromX, anim.toX, progress);
      let y = lerp(anim.fromY, anim.toY, progress);

      push();

      strokeWeight(5);
      stroke(CONFIG.cell.borderColor);

      fill(CONFIG.cell.bgColor);

      square(x, y, this.cellSize, 10);

      textAlign(CENTER, CENTER);
      textSize(this.cellSize / 1.5);

      fill(anim.sign === "x" ? "#F00" : "#00F");

      text(anim.sign, x + this.cellSize / 2, y + this.cellSize / 2);

      pop();
    }

    // șterge animațiile terminate
    this.animations = this.animations.filter((anim) => {
      return millis() - anim.startTime < anim.duration;
    });
  }

  completeLine(direction, cell) {
    let tempSign = cell.sign;
    switch (direction) {
      // animatiile sunt la fel si pentru LEFT, RIGHT, UP
      case CONFIG.board.direction.DOWN:
        //animatie cell selected - se parcurge coloana de jos in sus pentru a nu se suprascrie valori
        for (let i = cell.boardCoordY; i > 1; i--) {
          //se stabielste miscarea
          let fromCell = this.board[cell.boardCoordX][i - 1]; //de unde pleaca
          let toCell = this.board[cell.boardCoordX][i]; //unde ajunge

          //animatia propriu-zisa - pentru toate piesele care se deplaseaza normal pe coloana
          //se misca (sign)
          //de unde -> pana unde
          // cand incepe
          //cat dureaza
          this.animations.push({
            sign: fromCell.sign,
            fromX: fromCell.x,
            fromY: fromCell.y,
            toX: toCell.x,
            toY: toCell.y,
            startTime: millis(),
            duration: CONFIG.animationCellSelected.duration + 100,
          });
        }

        //piesa care iese(selected) si revine sus
        //piesa selectata porneste din celula selectata
        //ajunge sus pe coloana (index 1)
        this.animations.push({
          sign: tempSign,
          fromX: cell.x,
          fromY: cell.y,
          toX: this.board[cell.boardCoordX][1].x,
          toY: this.board[cell.boardCoordX][1].y,
          startTime: millis(),
          duration: CONFIG.animationCellSelected.duration + 100,
        });

        //actualizare tabla
        for (let i = cell.boardCoordY; i > 1; i--) {
          this.board[cell.boardCoordX][i].sign =
            this.board[cell.boardCoordX][i - 1].sign;
        }

        this.board[cell.boardCoordX][1].sign = tempSign; //piesa scoasa devine prima de sus

        break;
      case CONFIG.board.direction.UP:
        for (let i = cell.boardCoordY; i < 5; i++) {
          let fromCell = this.board[cell.boardCoordX][i + 1];

          let toCell = this.board[cell.boardCoordX][i];

          this.animations.push({
            sign: fromCell.sign,
            fromX: fromCell.x,
            fromY: fromCell.y,
            toX: toCell.x,
            toY: toCell.y,
            startTime: millis(),
            duration: CONFIG.animationCellSelected.duration + 100,
          });
        }

        this.animations.push({
          sign: tempSign,
          fromX: cell.x,
          fromY: cell.y,
          toX: this.board[cell.boardCoordX][5].x,
          toY: this.board[cell.boardCoordX][5].y,
          startTime: millis(),
          duration: CONFIG.animationCellSelected.duration + 100,
        });

        for (let i = cell.boardCoordY; i < 5; i++) {
          this.board[cell.boardCoordX][i].sign =
            this.board[cell.boardCoordX][i + 1].sign;
        }

        this.board[cell.boardCoordX][5].sign = tempSign;

        break;
      case CONFIG.board.direction.LEFT:
        for (let i = cell.boardCoordX; i < 5; i++) {
          let fromCell = this.board[i + 1][cell.boardCoordY];

          let toCell = this.board[i][cell.boardCoordY];

          this.animations.push({
            sign: fromCell.sign,
            fromX: fromCell.x,
            fromY: fromCell.y,
            toX: toCell.x,
            toY: toCell.y,
            startTime: millis(),
            duration: CONFIG.animationCellSelected.duration + 100,
          });
        }

        this.animations.push({
          sign: tempSign,
          fromX: cell.x,
          fromY: cell.y,
          toX: this.board[5][cell.boardCoordY].x,
          toY: this.board[5][cell.boardCoordY].y,
          startTime: millis(),
          duration: CONFIG.animationCellSelected.duration + 100,
        });

        for (let i = cell.boardCoordX; i < 5; i++) {
          this.board[i][cell.boardCoordY].sign =
            this.board[i + 1][cell.boardCoordY].sign;
        }

        this.board[5][cell.boardCoordY].sign = tempSign;

        break;
      case CONFIG.board.direction.RIGHT:
        for (let i = cell.boardCoordX; i > 1; i--) {
          let fromCell = this.board[i - 1][cell.boardCoordY];

          let toCell = this.board[i][cell.boardCoordY];

          this.animations.push({
            sign: fromCell.sign,
            fromX: fromCell.x,
            fromY: fromCell.y,
            toX: toCell.x,
            toY: toCell.y,
            startTime: millis(),
            duration: CONFIG.animationCellSelected.duration + 100,
          });
        }

        this.animations.push({
          sign: tempSign,
          fromX: cell.x,
          fromY: cell.y,
          toX: this.board[1][cell.boardCoordY].x,
          toY: this.board[1][cell.boardCoordY].y,
          startTime: millis(),
          duration: CONFIG.animationCellSelected.duration + 100,
        });

        for (let i = cell.boardCoordX; i > 1; i--) {
          this.board[i][cell.boardCoordY].sign =
            this.board[i - 1][cell.boardCoordY].sign;
        }

        this.board[1][cell.boardCoordY].sign = tempSign;

        break;
      default:
    }
  }
}
