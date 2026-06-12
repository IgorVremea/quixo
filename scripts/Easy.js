import CONFIG from "../config.js";

/*
  CLASA EASY (Inteligența Artificială de nivel Ușor)
  Acest script controlează deciziile calculatorului pentru nivelul Easy.
  Spre deosebire de nivelul Mediu, acest AI nu folosește nicio strategie.
  Nu calculează scoruri de fitness, ci doar alege o mutare complet la ghici.
*/
export class Easy {
  /*
   FUNCȚIA PRINCIPALĂ: Returnează o mutare simplă pentru jucătorul curent.
   board - Tabla curentă de joc.
   semnJucator - Semnul AI-ului ('x' sau 'o').
   Returnează coordonatele/obiectul mutării ideale sau null dacă nu mai poate muta.
  */
  obtineMutare(board, semnJucator) {
    // Luăm toate mutările legale de pe marginea tablei
    const mutariValide = board.getToateMutarileValide(semnJucator);

    // Dacă din un motiv oarecare nu se mai poate face nicio mutare, oprim algoritmul.
    if (mutariValide.length === 0) return null;

    // Strategie Easy: Alege o mutare complet la întâmplare din cele valide
    const indexAleator = Math.floor(Math.random() * mutariValide.length);

    // Returnăm mutarea extrasă la noroc, fără nicio analiză în plus
    return mutariValide[indexAleator];
  }
}
