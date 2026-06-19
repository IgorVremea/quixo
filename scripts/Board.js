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
          case "x":
          case "o":
            signTemp = CONFIG.board.boardScheme[y][x];
            isActive = true;
            typeTemp = CONFIG.cell.type.PIECE;
            break;
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
            (CONFIG.canvas.height - this.boardSize) / 2 + 40 + this.cellSize * y,
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
    background("#1b1009");
    cursor("default");

    // Fundal profesional de lemn pentru zona tablei
    push();

    const boardX = this.board[0][0].x;
    const boardY = this.board[0][0].y;
    const boardSize = this.cellSize * 7;

    noStroke();

    // rama exterioara
    fill("#3a210f");
    rect(boardX - 22, boardY - 22, boardSize + 44, boardSize + 44, 10);

    // textura lemn rama
    for (let i = 0; i < boardSize + 44; i += 18) {
      const shade = i % 36 === 0 ? "#7a4a24" : "#5a3318";
      fill(shade);
      rect(boardX - 22 + i, boardY - 22, 18, boardSize + 44, 2);
    }

    // lumina subtila peste rama
    fill("rgba(255, 232, 190, 0.10)");
    rect(boardX - 16, boardY - 16, boardSize + 32, 8, 6);

    // interiorul tablei
    fill("#6f421f");
    rect(boardX - 6, boardY - 6, boardSize + 12, boardSize + 12, 8);

    // textura fina in interior
    stroke("rgba(255, 232, 190, 0.16)");
    strokeWeight(1);
    for (let y = boardY + 6; y < boardY + boardSize; y += 16) {
      line(boardX + 8, y, boardX + boardSize - 8, y + sin(y * 0.04) * 4);
    }

    pop();

    let hoveredCell = null;
    let hasActiveAnimations = this.animations.length > 0;

    // Identificăm exact ce linie sau coloană se mișcă în acest moment
    let animatedX = null;
    let animatedY = null;
    if (hasActiveAnimations && 
          window.controller &&
          window.controller.activeCell) {
      animatedX = window.controller.activeCell.boardCoordX;
      animatedY = window.controller.activeCell.boardCoordY;
    }

    // 1. Desenăm fundalul fix al tablei
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        let currentCell = this.board[x][y];

        // VERIFICARE INTELIGENTĂ: Ascundem textul static din spate DOAR dacă celula curentă
        // face parte din coloana sau rândul care se mută acum. Restul tablei rămâne vizibil!
        let isPartOfMovingLine = false;
        if (hasActiveAnimations) {
          // Dacă mișcarea e pe verticală (X e fix, axa Y se mută) sau orizontală (Y e fix, axa X se mută)
          if (x === animatedX || y === animatedY) {
            isPartOfMovingLine = true;
          }
        }

        if (isPartOfMovingLine && currentCell.sign) {
          const originalSign = currentCell.sign;

          // Desenam celula fara semn, ca piesa animata sa nu treaca vizual peste X/O-ul static
          currentCell.sign = "";
          currentCell.draw();

          currentCell.sign = originalSign;
        } else {
          currentCell.draw();
        }

        if (currentCell.isHover(mouseX, mouseY)) {
          hoveredCell = currentCell;
        }
      }
    }

    // 2. Desenăm SELECTED (doar când nu se mișcă nimic)
    if (window.controller && window.controller.activeCell && !hasActiveAnimations) {
      window.controller.activeCell.draw(CONFIG.cell.states.HOVER);
    }

    // 3. Desenăm HOVER
    if (
      hoveredCell &&
      this.isCellOnEdge(hoveredCell.boardCoordX, hoveredCell.boardCoordY) &&
        hoveredCell.isActive){
      hoveredCell.draw(CONFIG.cell.states.HOVER);
      cursor("pointer");
    }

    // 4. MASCA DE DECUPARE PENTRU ANIMAȚII (Tăiere la fix pe interiorul 5x5)
    if (hasActiveAnimations) {
      push();

      let clipX = this.board[1][1].x;
      let clipY = this.board[1][1].y;
      let clipSize = this.cellSize * 5;

      drawingContext.beginPath();
      drawingContext.rect(clipX, clipY, clipSize, clipSize);
      drawingContext.clip();

      this.drawAnimations();

      pop();
    }
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

  // Randează piesele în mișcare
  drawAnimations() {
    for (let anim of this.animations) {
      let progress = (millis() - anim.startTime) / anim.duration;
      progress = constrain(progress, 0, 1);

      let x = lerp(anim.fromX, anim.toX, progress);
      let y = lerp(anim.fromY, anim.toY, progress);

      // Dacă animația rulează pentru o celulă care era goală, o ignorăm ca să nu deseneze pătrate albe fantomă
      if (anim.sign === "") continue;
      anim.isActive = false;
      push();

      fill("#b9783d");
      stroke("#3a210f");
      strokeWeight(4);

      rect(x, y, this.cellSize, this.cellSize, 6);
      // const tempCell = new Cell(CONFIG.cell.cellSize, x, y, undefined, undefined, anim.sign);
      textAlign(CENTER, CENTER);
      textSize(this.cellSize / 1.5);
      fill(anim.sign === "x" ? "#F00" : "#00F");
      text(anim.sign, x + this.cellSize / 2, y + this.cellSize / 2);

      pop();
    }

    // Curățare coadă animații
    this.animations = this.animations.filter((anim) => {
      return millis() - anim.startTime < anim.duration;
    });
  }

  completeLine(direction, cell) {
    let tempSign = cell.sign;

    // Eliberăm vizual celula de pe margine din primul moment al click-ului
    cell.sign = "";

    switch (direction) {
      case CONFIG.board.direction.DOWN:
        for (let i = cell.boardCoordY; i > 1; i--) {
          let fromCell = this.board[cell.boardCoordX][i - 1];
          let toCell = this.board[cell.boardCoordX][i];

          this.animations.push({
            sign: fromCell.sign,
            fromX: fromCell.x,
            fromY: fromCell.y,
            toX: toCell.x,
            toY: toCell.y,
            startTime: millis(),
            duration: CONFIG.animationCellSelected.duration,
          });
        }

        this.animations.push({
          sign: tempSign,
          fromX: cell.x,
          fromY: cell.y,
          toX: this.board[cell.boardCoordX][1].x,
          toY: this.board[cell.boardCoordX][1].y,
          startTime: millis(),
          duration: CONFIG.animationCellSelected.duration,
        });

        for (let i = cell.boardCoordY; i > 1; i--) {
          this.board[cell.boardCoordX][i].sign =
            this.board[cell.boardCoordX][i - 1].sign;
        }
        this.board[cell.boardCoordX][1].sign = tempSign;
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
            duration: CONFIG.animationCellSelected.duration,
          });
        }

        this.animations.push({
          sign: tempSign,
          fromX: cell.x,
          fromY: cell.y,
          toX: this.board[cell.boardCoordX][5].x,
          toY: this.board[cell.boardCoordX][5].y,
          startTime: millis(),
          duration: CONFIG.animationCellSelected.duration,
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
            duration: CONFIG.animationCellSelected.duration,
          });
        }

        this.animations.push({
          sign: tempSign,
          fromX: cell.x,
          fromY: cell.y,
          toX: this.board[5][cell.boardCoordY].x,
          toY: this.board[5][cell.boardCoordY].y,
          startTime: millis(),
          duration: CONFIG.animationCellSelected.duration,
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
            duration: CONFIG.animationCellSelected.duration,
          });
        }

        this.animations.push({
          sign: tempSign,
          fromX: cell.x,
          fromY: cell.y,
          toX: this.board[1][cell.boardCoordY].x,
          toY: this.board[1][cell.boardCoordY].y,
          startTime: millis(),
          duration: CONFIG.animationCellSelected.duration,
        });

        for (let i = cell.boardCoordX; i > 1; i--) {
          this.board[i][cell.boardCoordY].sign =
            this.board[i - 1][cell.boardCoordY].sign;
        }
        this.board[1][cell.boardCoordY].sign = tempSign;
        break;

      default:
        break;
    }
  }

  // ==========================================
  // METODE SPECIFICE PENTRU INTELIGENȚA ARTIFICIALĂ
  // ==========================================

  /**
   * Creează o clonă virtuală a tablei curente și aplică o mutare pe ea, instant, fără animații grafice.
   */
  copiazaSiAplicaMutare(mutare, semnJucator) {
    const copieTabla = new Board();

    // Copiem starea exactă a semnelor de pe tabla reală pe cea clonată
    for (let x = 0; x < 7; x++) {
      for (let y = 0; y < 7; y++) {
        copieTabla.board[x][y].sign = this.board[x][y].sign;
        copieTabla.board[x][y].isActive = this.board[x][y].isActive;
      }
    }

    // Identificăm piesa pe care AI-ul vrea să o ridice de pe margine pe tabla clonată
    let celulaSimulata = copieTabla.board[mutare.x][mutare.y];
    celulaSimulata.sign = semnJucator; // Îi atribuim semnul AI-ului ("o")

    // Aplicăm logica de împingere instantanee, fără animații
    copieTabla.completeLineLogic(mutare.directie, celulaSimulata);

    return copieTabla;
  }

  /**
   * Identică cu metoda ta 'completeLine', dar modifică doar matricea de string-uri, fără p5.js / animations.
   */
  completeLineLogic(direction, cell) {
    let tempSign = cell.sign;
    cell.sign = "";

    switch (direction) {
      case CONFIG.board.direction.DOWN:
        for (let i = cell.boardCoordY; i > 1; i--) {
          this.board[cell.boardCoordX][i].sign =
            this.board[cell.boardCoordX][i - 1].sign;
        }
        this.board[cell.boardCoordX][1].sign = tempSign;
        break;

      case CONFIG.board.direction.UP:
        for (let i = cell.boardCoordY; i < 5; i++) {
          this.board[cell.boardCoordX][i].sign =
            this.board[cell.boardCoordX][i + 1].sign;
        }
        this.board[cell.boardCoordX][5].sign = tempSign;
        break;

      case CONFIG.board.direction.LEFT:
        for (let i = cell.boardCoordX; i < 5; i++) {
          this.board[i][cell.boardCoordY].sign =
            this.board[i + 1][cell.boardCoordY].sign;
        }
        this.board[5][cell.boardCoordY].sign = tempSign;
        break;

      case CONFIG.board.direction.RIGHT:
        for (let i = cell.boardCoordX; i > 1; i--) {
          this.board[i][cell.boardCoordY].sign =
            this.board[i - 1][cell.boardCoordY].sign;
        }
        this.board[1][cell.boardCoordY].sign = tempSign;
        break;
    }
  }

  /**
   * Scanează marginea tablei (5x5) și returnează o listă cu toate mutările valide.
   */
  getToateMutarileValide(semnJucator) {
    let mutariValide = [];

    // Direcțiile posibile mapate din CONFIG
    const d = CONFIG.board.direction;

    // Parcurgem tabla interioară de 5x5
    for (let x = 1; x <= 5; x++) {
      for (let y = 1; y <= 5; y++) {
        // AI-ul poate alege doar piese de pe margine (isCellOnEdge)
        // și doar piese care sunt fie goale (""), fie îi aparțin deja
        if (
          this.isCellOnEdge(x, y) &&
          (this.board[x][y].sign === "" ||
            this.board[x][y].sign === semnJucator)
        ) {
          // Adăugăm direcțiile logice în funcție de poziția piesei pe tablă
          if (x === 1) mutariValide.push({ x, y, directie: d.RIGHT });
          if (x === 5) mutariValide.push({ x, y, directie: d.LEFT });
          if (y === 1) mutariValide.push({ x, y, directie: d.DOWN });
          if (y === 5) mutariValide.push({ x, y, directie: d.UP });
        }
      }
    }
    return mutariValide;
  }

  /**
   * Numără câte piese de un anumit tip sunt pe tablă (folositor pentru fitness-ul modului Easy)
   */
  numaraPiese(semnJucator) {
    let count = 0;
    for (let x = 1; x <= 5; x++) {
      for (let y = 1; y <= 5; y++) {
        if (this.board[x][y].sign === semnJucator) count++;
      }
    }
    return count;
  }
}
