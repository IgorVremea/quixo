import CONFIG from "../config.js";

export class Moderate {
  /**
   * Analizează mutările și o alege pe cea cu cel mai bun scor de fitness.
   */
  obtineMutare(board, semnJucator) {
    const mutariValide = board.getToateMutarileValide(semnJucator);
    if (mutariValide.length === 0) return null;

    let ceaMaiBunaMutare = null;
    let scorMaxim = -Infinity;

    const semnAdversar = semnJucator === "x" ? "o" : "x";

    for (const mutare of mutariValide) {
      const tablaSimulata = board.copiazaSiAplicaMutare(mutare, semnJucator);

      let scorMutare = this.calculeazaFitness(
        tablaSimulata,
        semnJucator,
        semnAdversar,
      );

      if (scorMutare > scorMaxim) {
        scorMaxim = scorMutare;
        ceaMaiBunaMutare = mutare;
      }
    }

    return ceaMaiBunaMutare;
  }

  /**
   * Funcția de fitness îmbunătățită
   */
  calculeazaFitness(tablaSimulata, aiSign, playerSign) {
    let scor = 0;

    // 1. Verificăm dacă mutarea aduce victoria instantă pentru AI sau o oferă adversarului
    // Folosim logica pe care o ai deja în proiect (presupunând că returnează semnul câștigător sau null)
    let castigatorSimulat = this.verificaCastigatorPeTabla(tablaSimulata);

    if (castigatorSimulat === aiSign) {
      return 10000; // Victorie instantă! Prioritate maximă
    }
    if (castigatorSimulat === playerSign) {
      return -10000; // Îl ajută pe om să câștige. Evită complet!
    }

    // 2. Evaluăm liniile, coloanele și diagonalele din interior
    let maxAliniateAI = this.calcululMaximAliniat(tablaSimulata, aiSign);
    let maxAliniateOm = this.calcululMaximAliniat(tablaSimulata, playerSign);

    // AI-ul primește puncte exponențiale pentru piesele lui legate (încurajăm atacul)
    if (maxAliniateAI === 4) scor += 500;
    else if (maxAliniateAI === 3) scor += 100;
    else if (maxAliniateAI === 2) scor += 20;

    // 3. Blocaj: Dacă omul are 4 piese aliniate în interior și AI-ul nu îl oprește, penalizăm mutarea.
    // Dacă AI-ul reușește să reducă numărul de piese aliniate ale omului sub 4, mutarea e foarte bună.
    if (maxAliniateOm >= 4) {
      scor -= 800; // Situație extrem de periculoasă
    } else if (maxAliniateOm === 3) {
      scor -= 50; // Prevenim formarea unei linii de 4
    }

    // Adăugăm și un mic bonus general pentru numărul total de piese, ca să menținem și logica ta inițială
    scor += tablaSimulata.numaraPiese(aiSign) * 2;

    return scor;
  }

  /**
   * METODĂ NOUĂ DE AJUTOR: Calculează cel mai lung rând consecutiv al unui jucător
   */
  calcululMaximAliniat(tablaSimulata, semn) {
    let b = tablaSimulata.board; // Matricea de piese
    let maxInLiniat = 0;

    // Scanare Linii (rândurile 1-5 din interior)
    for (let y = 1; y <= 5; y++) {
      let curent = 0;
      for (let x = 1; x <= 5; x++) {
        if (b[x][y].sign === semn) curent++;
        else {
          maxInLiniat = Math.max(maxInLiniat, curent);
          curent = 0;
        }
      }
      maxInLiniat = Math.max(maxInLiniat, curent);
    }

    // Scanare Coloane
    for (let x = 1; x <= 5; x++) {
      let curent = 0;
      for (let y = 1; y <= 5; y++) {
        if (b[x][y].sign === semn) curent++;
        else {
          maxInLiniat = Math.max(maxInLiniat, curent);
          curent = 0;
        }
      }
      maxInLiniat = Math.max(maxInLiniat, curent);
    }

    // Diagonala principală
    let curentDiag1 = 0;
    for (let i = 1; i <= 5; i++) {
      if (b[i][i].sign === semn) curentDiag1++;
      else {
        maxInLiniat = Math.max(maxInLiniat, curentDiag1);
        curentDiag1 = 0;
      }
    }
    maxInLiniat = Math.max(maxInLiniat, curentDiag1);

    // Diagonala secundară
    let curentDiag2 = 0;
    for (let i = 1; i <= 5; i++) {
      if (b[6 - i][i].sign === semn) curentDiag2++;
      else {
        maxInLiniat = Math.max(maxInLiniat, curentDiag2);
        curentDiag2 = 0;
      }
    }
    maxInLiniat = Math.max(maxInLiniat, curentDiag2);

    return maxInLiniat;
  }

  /**
   * METODĂ NOUĂ DE AJUTOR: Verifică dacă există deja un câștigător pe tabla simulată
   */
  verificaCastigatorPeTabla(tablaSimulata) {
    let b = tablaSimulata.board;

    // Linii
    for (let y = 1; y <= 5; y++) {
      let first = b[1][y].sign;
      if (
        first !== "" &&
        b[2][y].sign === first &&
        b[3][y].sign === first &&
        b[4][y].sign === first &&
        b[5][y].sign === first
      )
        return first;
    }
    // Coloane
    for (let x = 1; x <= 5; x++) {
      let first = b[x][1].sign;
      if (
        first !== "" &&
        b[x][2].sign === first &&
        b[x][3].sign === first &&
        b[x][4].sign === first &&
        b[x][5].sign === first
      )
        return first;
    }
    // Diagonale
    if (
      b[1][1].sign !== "" &&
      b[2][2].sign === b[1][1].sign &&
      b[3][3].sign === b[1][1].sign &&
      b[4][4].sign === b[1][1].sign &&
      b[5][5].sign === b[1][1].sign
    )
      return b[1][1].sign;
    if (
      b[5][1].sign !== "" &&
      b[4][2].sign === b[5][1].sign &&
      b[3][3].sign === b[5][1].sign &&
      b[2][4].sign === b[5][1].sign &&
      b[1][5].sign === b[5][1].sign
    )
      return b[5][1].sign;

    return null;
  }
}
