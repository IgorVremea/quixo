class Controller {
  constructor() {
    this.board = new Board();
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
  tick() {
    // ce se întâmplă în fiecare „cadru” (fps)
    this.board.draw();

    textSize(20);

    textAlign(LEFT, CENTER);

    fill(255);

    text("Rândul:", CONFIG.canvas.width / 2 - 160, 30);

    let playerColor = this.currentSign === "x" ? "#EC4899" : "#3B82F6";
    fill(playerColor);

    text(
      this.getCurrentPlayerName() + " (" + this.currentSign.toUpperCase() + ")",
      CONFIG.canvas.width / 2 - 80,
      30,
    );
  }
  changeBoardMode(cell) {
    // intrăm în modul de schimbare a rândurilor (după selectarea celulei)
    if (
      cell != undefined &&
      this.isInChangeBoardMode &&
      this.isChangedState &&
      cell.type == CONFIG.cell.type.PIECE &&
      this.board.isCellOnEdge(cell.boardCoordX, cell.boardCoordY)
    ) {
      this.isChangedState = false;
      console.log(cell.boardCoordX + " " + cell.boardCoordY);
      // activăm segețile doar necesare
      this.board.board[cell.boardCoordX][0].isActive =
        cell.boardCoordY == 1 ? false : true;
      this.board.board[cell.boardCoordX][6].isActive =
        cell.boardCoordY == 5 ? false : true;
      this.board.board[0][cell.boardCoordY].isActive =
        cell.boardCoordX == 1 ? false : true;
      this.board.board[6][cell.boardCoordY].isActive =
        cell.boardCoordX == 5 ? false : true;
    } else {
    }
  }
  cellClick(cell, sign = this.currentSign) {
    // acțiunea pentru alegerea celulei
    if (!cell) return;
    // dacă e segeata
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
    // dacă e piesă
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
