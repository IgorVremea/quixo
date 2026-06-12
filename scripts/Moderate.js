import CONFIG from "../config.js";

/*
  CLASA MODERATE (Inteligența Artificială de nivel Mediu)
  Acest script controlează deciziile luate de calculator.
  AI-ul nu joacă la întâmplare și nici nu folosește strategii complicate pe termen lung.
  El doar analizează toate opțiunile pe care le are în tura curentă, le testează în minte,
  le dă o notă (scor de fitness) și o alege pe cea mai avantajoasă.
 */
export class Moderate {
  /*
   FUNCȚIA PRINCIPALĂ: Alege cea mai bună mutare posibilă pentru AI în tura curentă.
  board - Starea actuală a tablei de joc.
  semnJucator - Semnul cu care joacă AI-ul (ex: "x" sau "o").
  Returnează coordonatele/obiectul mutării ideale sau null dacă nu mai poate muta.
   */
  obtineMutare(board, semnJucator) {
    // Pas 1: Aflăm ce opțiuni legale avem pe tablă în acest moment.
    const mutariValide = board.getToateMutarileValide(semnJucator);

    // Dacă din un motiv oarecare nu se mai poate face nicio mutare, oprim algoritmul.
    if (mutariValide.length === 0) return null;

    let ceaMaiBunaMutare = null;
    let scorMaxim = -Infinity; // Pornim de la cea mai mică valoare posibilă pentru a ne asigura că orice scor real va fi mai mare.

    // Pas 2: Identificăm cu ce semn joacă adversarul (omul) ca să știm de cine ne apărăm.
    const semnAdversar = semnJucator === "x" ? "o" : "x";

    // Pas 3: Luăm la rând fiecare mutare posibilă și o testăm.
    for (const mutare of mutariValide) {
      // IMPORTANT: Nu modificăm tabla reală a jocului!
      // Creăm o clonă („o masă de teste”) și aplicăm mutarea acolo ca să vedem ce s-ar întâmpla.
      const tablaSimulata = board.copiazaSiAplicaMutare(mutare, semnJucator);

      // Trimitem „clona” la evaluator pentru a primi o notă numerică.
      let scorMutare = this.calculeazaFitness(
        tablaSimulata,
        semnJucator,
        semnAdversar,
      );

      // Dacă această mutare simulată e mai bună decât tot ce am testat până acum, o salvăm ca fiind „favorită”.
      if (scorMutare > scorMaxim) {
        scorMaxim = scorMutare;
        ceaMaiBunaMutare = mutare;
      }
    }

    // Pas 4: După ce am analizat toate variantele, executăm mutarea cu cel mai mare scor.
    return ceaMaiBunaMutare;
  }

  /*
   EVALUATORUL (Funcția de Fitness)
   Primește o tablă simulată și calculează o notă. Cu cât nota e mai mare, cu atât mutarea e mai profitabilă.
   Strategie implementată: Victorie > Apărare (Blocaj) > Atac (Aliniere piese proprii).
   */
  calculeazaFitness(tablaSimulata, aiSign, playerSign) {
    let scor = 0;

    // --- STRATEGIA 1: CÂȘTIG SAU MOARTE (Prioritate Absolută) ---
    // Verificăm dacă mutarea proaspăt făcută a încheiat deja jocul pe tabla simulată.
    let castigatorSimulat = this.verificaCastigatorPeTabla(tablaSimulata);

    if (castigatorSimulat === aiSign) {
      return 10000; // Victorie instantă! AI-ul va alege această mutare fără să mai stea pe gânduri.
    }
    if (castigatorSimulat === playerSign) {
      return -10000; // Această mutare îi dă ocazia omului să câștige. O penalizăm masiv ca să o evităm complet.
    }

    // --- STRATEGIA 2: ANALIZA FORMURILOR DE PIESE ---
    // Verificăm câte piese legate la rând au reușit să strângă AI-ul și Omul în această simulare.
    let maxAliniateAI = this.calcululMaximAliniat(tablaSimulata, aiSign);
    let maxAliniateOm = this.calcululMaximAliniat(tablaSimulata, playerSign);

    // Recompensăm AI-ul dacă mutarea îi construiește linii consecutive (Atac):
    if (maxAliniateAI === 4)
      scor += 500; // Foarte aproape de victorie (are 4 din 5)
    else if (maxAliniateAI === 3)
      scor += 100; // Construiește o bază bună de atac
    else if (maxAliniateAI === 2) scor += 20; // Un început minor de aliniere

    // --- STRATEGIA 3: BLOCAREA ADVERSARULUI (Aparare) ---
    // Dacă omul are deja piese aliniate și AI-ul NU le-a blocat prin această mutare, penalizăm decizia:
    if (maxAliniateOm >= 4) {
      scor -= 800; // Pericol de moarte! Omul are 4 piese legate și va câștiga tura următoare dacă nu intervenim.
    } else if (maxAliniateOm === 3) {
      scor -= 50; // Încercăm să îi stricăm planul din timp, înainte să facă o linie de 4.
    }

    // --- STRATEGIA 4: BONUS DE CANTITATE ---
    // Dacă mutările oferă scoruri de aliniere egale, o alegem pe cea în care AI-ul rămâne cu mai multe piese totale pe tablă.
    scor += tablaSimulata.numaraPiese(aiSign) * 2;

    return scor;
  }

  /*
   SCANERUL DE CONSECUTIVITATE
   Se plimbă pe toată tabla (linii, coloane, diagonale) și caută cel mai lung șir de piese lipite
   aparținând aceluiași jucător. Rezultatul va fi un număr de la 0 la 5.
   */
  calcululMaximAliniat(tablaSimulata, semn) {
    let b = tablaSimulata.board; // Extragem matricea efectivă de piese (care e de 5x5 în interior)
    let maxInLiniat = 0;

    // 1. Scanare pe Orizontală (Linie cu linie, de sus în jos)
    for (let y = 1; y <= 5; y++) {
      let curent = 0;
      for (let x = 1; x <= 5; x++) {
        if (b[x][y].sign === semn)
          curent++; // Am găsit o piesă de-a noastră? Creștem contorul.
        else {
          maxInLiniat = Math.max(maxInLiniat, curent); // Linia s-a întrerupt. Salvăm recordul dacă e cazul...
          curent = 0; // ...și resetăm contorul pentru restul liniei.
        }
      }
      maxInLiniat = Math.max(maxInLiniat, curent); // Verificare finală la capătul liniei
    }

    // 2. Scanare pe Verticală (Coloană cu coloană, de la stânga la dreapta)
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

    // 3. Scanare pe Diagonala Principală (\ - de sus-stânga în jos-dreapta)
    let curentDiag1 = 0;
    for (let i = 1; i <= 5; i++) {
      if (b[i][i].sign === semn) curentDiag1++;
      else {
        maxInLiniat = Math.max(maxInLiniat, curentDiag1);
        curentDiag1 = 0;
      }
    }
    maxInLiniat = Math.max(maxInLiniat, curentDiag1);

    // 4. Scanare pe Diagonala Secundară (/ - de sus-dreapta în jos-stânga)
    let curentDiag2 = 0;
    for (let i = 1; i <= 5; i++) {
      if (b[6 - i][i].sign === semn)
        curentDiag2++; // Formula `6 - i` ne ajută să mergem în sens invers pe axa X
      else {
        maxInLiniat = Math.max(maxInLiniat, curentDiag2);
        curentDiag2 = 0;
      }
    }
    maxInLiniat = Math.max(maxInLiniat, curentDiag2);

    return maxInLiniat; // Returnăm cel mai mare număr de piese legate găsit oriunde pe tablă.
  }

  /*
    ARBITRUL (Verifică dacă s-a terminat jocul)
    Caută dacă există o linie perfectă de 5 piese la fel.
    Returnează semnul câștigător ("x"/"o") sau null dacă nu a câștigat nimeni încă.
   */
  verificaCastigatorPeTabla(tablaSimulata) {
    let b = tablaSimulata.board;

    // Verificăm cele 5 linii: dacă toate cele 5 căsuțe au același semn (și nu sunt goale), avem un câștigător.
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

    // Verificăm cele 5 coloane analog.
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

    // Verificăm Diagonala Principală (\)
    if (
      b[1][1].sign !== "" &&
      b[2][2].sign === b[1][1].sign &&
      b[3][3].sign === b[1][1].sign &&
      b[4][4].sign === b[1][1].sign &&
      b[5][5].sign === b[1][1].sign
    )
      return b[1][1].sign;

    // Verificăm Diagonala Secundară (/)
    if (
      b[5][1].sign !== "" &&
      b[4][2].sign === b[5][1].sign &&
      b[3][3].sign === b[5][1].sign &&
      b[2][4].sign === b[5][1].sign &&
      b[1][5].sign === b[5][1].sign
    )
      return b[5][1].sign;

    // Dacă am rulat toate testele și nu există nicio linie completă de 5, înseamnă că meciul continuă.
    return null;
  }
}
