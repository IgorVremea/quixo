class Controller {
  constructor() {
    this.board = new Board();

    this.isInChangeBoardMode = false;
    this.isChangedState = false;

    this.activeCell = null;

    this.currentSign = "x";

    this.winnerText = "";

    this.players = {
      x: "Player 1",
      o: "Player 2",
    };
  }

  // delay cu Promise
  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  getCurrentPlayerName() {
    return this.players[this.currentSign];
  }

  // adaugă punct câștigătorului
  addPointToWinner(sign) {
    RB.scores[sign]++;
  }

  tick() {
    this.checkBtn();

    this.board.draw();

    // text tură
    textSize(20);

    textAlign(LEFT, CENTER);

    fill(255);

    text("Rândul:", CONFIG.canvas.width / 2 - 160, 30);

    let playerColor = this.currentSign === "x" ? "#3B82F6" : "#EC4899";

    fill(playerColor);

    text(
      this.getCurrentPlayerName() + " (" + this.currentSign.toUpperCase() + ")",
      CONFIG.canvas.width / 2 - 80,
      30,
    );

    // afișare câștigător
    if (this.winnerText !== "") {
      let boxWidth = 420;
      let boxHeight = 100;

      let x = CONFIG.canvas.width / 2 - boxWidth / 2;
      let y = CONFIG.canvas.height / 2 - boxHeight / 2;

      // fundal alb
      fill(255, 255, 255, 220);

      stroke("#fdfffe"); // contur

      strokeWeight(4);

      rect(x, y, boxWidth, boxHeight, 20);

      // text
      textAlign(CENTER, CENTER);

      textSize(42);

      fill("#000000");

      noStroke();

      text(this.winnerText, CONFIG.canvas.width / 2, CONFIG.canvas.height / 2);
    }
  }

  changeBoardMode(cell) {
    if (
      cell != undefined &&
      this.isInChangeBoardMode &&
      this.isChangedState &&
      cell.type == CONFIG.cell.type.PIECE &&
      this.board.isCellOnEdge(cell.boardCoordX, cell.boardCoordY)
    ) {
      this.isChangedState = false;

      this.board.board[cell.boardCoordX][0].isActive =
        cell.boardCoordY == 1 ? false : true;

      this.board.board[cell.boardCoordX][6].isActive =
        cell.boardCoordY == 5 ? false : true;

      this.board.board[0][cell.boardCoordY].isActive =
        cell.boardCoordX == 1 ? false : true;

      this.board.board[6][cell.boardCoordY].isActive =
        cell.boardCoordX == 5 ? false : true;
    }
  }

  checkBtn() {}

  // verificare câștigător - verificare toate variantele posibile de castig
  checkWinner() {
    let b = this.board.board;

    // linii
    for (let y = 1; y <= 5; y++) {
      let first = b[1][y].sign;

      if (first === "") continue;

      let win = true;

      for (let x = 2; x <= 5; x++) {
        if (b[x][y].sign !== first) {
          win = false;
          break;
        }
      }

      if (win) {
        return first;
      }
    }

    // coloane
    for (let x = 1; x <= 5; x++) {
      let first = b[x][1].sign;

      if (first === "") continue;

      let win = true;

      for (let y = 2; y <= 5; y++) {
        if (b[x][y].sign !== first) {
          win = false;
          break;
        }
      }

      if (win) {
        return first;
      }
    }

    // diagonala principală
    let firstDiag = b[1][1].sign;

    if (firstDiag !== "") {
      let win = true;

      for (let i = 2; i <= 5; i++) {
        if (b[i][i].sign !== firstDiag) {
          win = false;
          break;
        }
      }

      if (win) {
        return firstDiag;
      }
    }

    // diagonala secundară
    let secondDiag = b[5][1].sign;

    if (secondDiag !== "") {
      let win = true;

      for (let i = 1; i <= 5; i++) {
        if (b[6 - i][i].sign !== secondDiag) {
          win = false;
          break;
        }
      }

      if (win) {
        return secondDiag;
      }
    }

    return null;
  }

  // reset tablă
  resetGameBoard() {
    this.board = new Board();

    this.isInChangeBoardMode = false;
    this.isChangedState = false;

    this.activeCell = null;

    this.currentSign = "x";

    this.winnerText = "";
  }

  // afișare câștigător pe ecran
  async showWinner(winner) {
    this.winnerText = this.players[winner] + " a câștigat!";

    await this.delay(2000);

    this.resetGameBoard();
  }

  async cellClick(cell, sign = this.currentSign) {
    if (!cell) return;

    // click pe săgeată
    if (
      cell.type == CONFIG.cell.type.ARROW &&
      cell.isActive &&
      this.activeCell != null
    ) {
      this.isInChangeBoardMode = false;

      this.board.turnArrowsOff();

      let tempDir;

      switch (cell.sign) {
        case "↑":
          tempDir = CONFIG.board.direction.UP;
          break;

        case "↓":
          tempDir = CONFIG.board.direction.DOWN;
          break;

        case "→":
          tempDir = CONFIG.board.direction.RIGHT;
          break;

        case "←":
          tempDir = CONFIG.board.direction.LEFT;
          break;
      }

      this.board.completeLine(tempDir, this.activeCell);

      this.activeCell = null;

      // verificare câștigător
      let winner = this.checkWinner();

      if (winner) {
        this.addPointToWinner(winner);

        await this.showWinner(winner);

        return;
      }

      // schimbare tură
      this.currentSign = this.currentSign == "x" ? "o" : "x";
    }

    // selectare piesă
    if (
      cell != null &&
      this.board.isCellOnEdge(cell.boardCoordX, cell.boardCoordY) &&
      cell.type == CONFIG.cell.type.PIECE &&
      !this.isInChangeBoardMode &&
      (cell.sign == "" || cell.sign == this.currentSign)
    ) {
      this.isInChangeBoardMode = true;

      this.isChangedState = true;

      this.changeBoardMode(cell);

      if (sign == "x" || sign == "o") {
        cell.sign = sign;

        this.activeCell = cell;
      } else {
        cell.sign = "";
      }
    }
  }
}
