import CONFIG from "../config.js";

export class Easy {
  /**
   * Returnează o mutare simplă pentru jucătorul curent.
   * @param {Board} board - Tabla curentă de joc
   * @param {string} semnJucator - Semnul AI-ului ('x' sau 'o')
   */
  obtineMutare(board, semnJucator) {
    // 1. Luăm toate mutările legale de pe marginea tablei
    const mutariValide = board.getToateMutarileValide(semnJucator);

    if (mutariValide.length === 0) return null;

    // 2. Strategie Easy: Alege o mutare complet la întâmplare din cele valide
    const indexAleator = Math.floor(Math.random() * mutariValide.length);

    return mutariValide[indexAleator];
  }
}
