class Controller {
  constructor(board) {
    this.board = board;

    this.isInChangeBoardMode = false;
    this.isChangedState = false;

    this.activeCell = null;

    this.currentSign = "x";

    this.players = {
      x: "Player 1",
      o: "Player 2",
    };
  }

  getCurrentPlayerName() {
    return this.players[this.currentSign];
  }

  // adaugă punct câștigătorului
  addPointToWinner(sign) {
    RB.scores[sign]++;
  }

  // evidențiere casete câștigătoare
  highlightWinningCells(cells) {
    for (let cell of cells) {
      cell.isWinner = true;
    }
  }

  tick() {
    this.checkBtn();

    this.board.draw();

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

  // verificare câștigător
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
        let winningCells = [];

        for (let x = 1; x <= 5; x++) {
          winningCells.push(b[x][y]);
        }

        this.highlightWinningCells(winningCells);

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
        let winningCells = [];

        for (let y = 1; y <= 5; y++) {
          winningCells.push(b[x][y]);
        }

        this.highlightWinningCells(winningCells);

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
        let winningCells = [];

        for (let i = 1; i <= 5; i++) {
          winningCells.push(b[i][i]);
        }

        this.highlightWinningCells(winningCells);

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
        let winningCells = [];

        for (let i = 1; i <= 5; i++) {
          winningCells.push(b[6 - i][i]);
        }

        this.highlightWinningCells(winningCells);

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
  }

  cellClick(cell, sign = this.currentSign) {
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

        setTimeout(() => {
          alert(this.players[winner] + " a câștigat!");

          this.resetGameBoard();
        }, 500);

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
