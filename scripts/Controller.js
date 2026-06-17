import CONFIG from "../config.js";
import { Board } from "./Board.js";
import { RB } from "./button.js";
import { Easy } from "./Easy.js";
import { Moderate } from "./Moderate.js";

export class Controller {
  constructor() {
    this.board = new Board();

    this.isInChangeBoardMode = false;
    this.isChangedState = false;

    this.activeCell = null;

    // Semne pentru om vs computer (inversarea rolurilor trebuie să schimbe semnele)
    this.humanSign = "x";
    this.aiSign = "o";

    // În runda curentă, mută cine are semnul din currentSign
    // (umanul va muta când currentSign == humanSign)
    this.currentSign = this.humanSign;
    this.winnerText = "";

    this.players = {
      x: "Player 1",
      o: "Player 2",
    };

    this.aiEngines = {
      easy: new Easy(),
      moderate: new Moderate(),
    };

    // Proprietăți pentru controlul AI-ului
    this.vsComputer = false;
    this.dificultateCurenta = "hvh";
    this.modSelectatProvizoriu = "hvh";
    this.isAiThinking = false; // Previne click-urile umane în timpul procesării AI

    // PUNTE GLOBALĂ: Legăm direct elementele din HTML cu instanța curentă a Controller-ului
    window.interfataJoc = (actiune) => {
      if (actiune === "apasatStart") {
        this.showFormBtnHanddle();
      } else if (actiune === "pornesteJocul") {
        this.startGameBtnHanddle();
      } else {
        this.selecteazaMod(actiune);
      }
    };
  }

  showFormBtnHanddle() {
    // Ascunde butonul inițial de Start New Game
    document.getElementById("startBtn").style.display = "none";

    // Afișează panoul cu cele 3 moduri de joc în format flex vertical
    let menu = document.getElementById("gameModeSelection");
    menu.style.display = "flex";
    menu.style.flexDirection = "column";
    menu.style.alignItems = "center";
  }

  selecteazaMod(mod) {
    this.modSelectatProvizoriu = mod;

    let inputX = document.getElementById("playerX");
    let inputO = document.getElementById("playerO");
    let containerO = document.getElementById("playerOContainer");
    let formTitle = document.getElementById("nameFormTitle");

    if (mod === "hvh") {
      // Modul Human vs Human: arătăm ambele input-uri intacte
      formTitle.innerText = "Introdu numele jucătorilor:";
      inputX.placeholder = "Jucătorul 1 (X)";
      inputO.value = "";
      containerO.style.display = "block"; // Se vede și al doilea câmp
    } else {
      // Modurile cu Computer: schimbăm titlul textului și ascundem al doilea câmp
      formTitle.innerText = "Introdu numele tău:";
      inputX.placeholder = "Numele tău (X)";

      // Completăm automat în spate numele AI-ului pentru afișarea corectă a scorului
      inputO.value = mod === "easy" ? "Computer (Easy)" : "Computer (Moderate)";
      containerO.style.display = "none"; // Ascundere completă din interfață
    }

    // Ascundem lista butoanelor de moduri
    document.getElementById("gameModeSelection").style.display = "none";

    // Afișăm formularul adaptat dinamic (cu 1 sau 2 căsuțe)
    document.getElementById("nameForm").style.display = "block";
  }

  startGameBtnHanddle() {
    let pX = document.getElementById("playerX").value;
    let pO = document.getElementById("playerO").value;
    let mod = this.modSelectatProvizoriu;

    if (pX === "" || pO === "") {
      alert("Te rugăm să introduci un nume valid!");
      return;
    }

    this.players.x = pX;
    this.players.o = pO;

    if (mod === "hvh") {
      this.vsComputer = false;
    } else {
      this.vsComputer = true;
      this.dificultateCurenta = mod;
    }

    // Ascundem tot ecranul de start și activăm secțiunea în care randează p5.js
    document.getElementById("start-section").style.display = "none";
    document.getElementById("game-div").classList.remove("hidden");
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getCurrentPlayerName() {
    return this.players[this.currentSign];
  }

  addPointToWinner(sign) {
    RB.scores[sign]++;
  }

  tick() {
    this.checkBtn();
    this.board.draw();
    this.drawWinner();

    // Verificare continuă automatizată pentru rândul AI-ului
    this.veridicaRandulAI();
  }

  /**
   * Rutină automată executată în bucla p5.js (tick) pentru mutările calculatorului
   */
  /**
   * Rutină automată executată în bucla p5.js (tick) pentru mutările calculatorului
   */
  async veridicaRandulAI() {
    // Verificăm dacă este modul vs Computer, dacă este rândul lui (semnul actual al AI-ului),
    // jocul nu s-a terminat și nu rulează alte animații.
    // Notă: aici codul tău avea semnul "o" hardcodat; asta rupea inversarea rolurilor.
    if (
      this.vsComputer &&
      this.currentSign === this.aiSign &&
      this.winnerText === "" &&
      this.board.animations.length === 0 &&
      !this.isAiThinking
    ) {
      this.isAiThinking = true;

      // O mică pauză de 1 secundă înainte ca AI-ul să mute, pentru a nu fi instantaneu
      await this.delay(1000);

      // Cerem mutarea calculată de motorul de AI (easy sau moderate)
      let mutareRecomandata = this.cereSugestie();

      if (mutareRecomandata) {
        // 1. Preluăm piesa de pe marginea tablei aleasă de AI
        let piesaAlesa =
          this.board.board[mutareRecomandata.x][mutareRecomandata.y];

        // O setăm ca fiind piesa activă și îi atribuim semnul AI-ului
        piesaAlesa.sign = this.aiSign;
        this.activeCell = piesaAlesa;

        // 2. Executăm mutarea și împingerea pe linie în mod direct, fără să mai simulăm click-uri pe săgeți
        this.board.completeLine(mutareRecomandata.directie, this.activeCell);

        // Resetăm starea controllerului pentru următoarea mutare
        this.activeCell = null;
        this.isInChangeBoardMode = false;
        this.board.turnArrowsOff();

        // 3. Verificăm imediat dacă această mutare a generat un câștigător
        let winner = this.checkWinner();
        if (winner) {
          this.addPointToWinner(winner);
          await this.showWinner(winner);
          this.isAiThinking = false;
          return;
        }

        // Schimbăm rândul înapoi la jucătorul uman
        this.currentSign = this.humanSign;
      }

      this.isAiThinking = false;
    }
  }

  drawWinner() {
    textSize(20);
    textAlign(LEFT, CENTER);
    fill(255);
    let playerColor = this.currentSign === "x" ? "#EC4899" : "#3B82F6";
    fill(playerColor);
    text(this.currentSign.toUpperCase(), CONFIG.canvas.width / 2 - 160, 30);

   // if (this.winnerText !== "") {
   //   let boxWidth = 420;
    //  let boxHeight = 100;
    //  let x = CONFIG.canvas.width / 2 - boxWidth / 2;
    //  let y = CONFIG.canvas.height / 2 - boxHeight / 2 + 220;

      //fill(255, 255, 255, 220);
      //stroke("#fdfffe");
      //strokeWeight(4);
     // rect(x, y, boxWidth, boxHeight, 20);

      textAlign(CENTER, CENTER);
      textSize(42);
      fill("#000000");
      noStroke();
      text(
        this.winnerText,
        CONFIG.canvas.width / 2,
        CONFIG.canvas.height / 2 + 220,
      );
    }
  //}

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
      if (win) return first;
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
      if (win) return first;
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
      if (win) return firstDiag;
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
      if (win) return secondDiag;
    }
    return null;
  }

  swapRolesForRound() {
    // Inversăm semnele (tu devii semnul opus în runda următoare)
    const oldHuman = this.humanSign;
    this.humanSign = this.aiSign;
    this.aiSign = oldHuman;

    // În runda următoare tu începi (cum ai cerut)
    this.currentSign = this.humanSign;
  }

  resetGameBoard() {
    this.board = new Board();
    this.isInChangeBoardMode = false;
    this.isChangedState = false;
    this.activeCell = null;
    // setăm din nou runda astfel încât să fie corect pentru semnele curente
    this.currentSign = this.humanSign;
    this.winnerText = "";
    this.isAiThinking = false;
  }

  async showWinner(winner) {
    this.winnerText = this.players[winner] + " a câștigat!";
    await this.delay(5000);
    this.resetGameBoard();
  }

  async cellClick(cell, sign = this.currentSign) {
    if (this.board.animations.length > 0 || this.winnerText !== "") return;
    if (!cell) return;

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

      let winner = this.checkWinner();
      if (winner) {
        this.addPointToWinner(winner);
        await this.showWinner(winner);
        return;
      }

      this.currentSign = this.currentSign == "x" ? "o" : "x";
    }

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

  cereSugestie() {
    if (this.winnerText !== "" || this.board.animations.length > 0) return null;

    if (this.dificultateCurenta === "easy") {
      return this.aiEngines.easy.obtineMutare(this.board, this.currentSign);
    } else if (this.dificultateCurenta === "moderate") {
      return this.aiEngines.moderate.obtineMutare(this.board, this.currentSign);
    }
    return null;
  }
}
