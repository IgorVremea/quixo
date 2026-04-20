function showForm() {
  // Ascunde butonul de sus
  document.getElementById("startBtn").style.display = "none";

  // Arată formularul cu nume
  document.getElementById("nameForm").style.display = "block";
}
function startGame(){
    if(!controller){
        console.log("Controller nu e încă gata!");
        return;
    }

    controller.players.x = document.getElementById("playerX").value || "Player X";
    controller.players.o = document.getElementById("playerO").value || "Player O";

    document.getElementById("menu").style.display = "none";
}

  // Salvează numele jucătorilor
  localStorage.setItem("player1", p1);
  localStorage.setItem("player2", p2);

  // Redirecționează către pagina cu tabla jocului
  //   Urca 2 nivele
  window.location.href = "../../index.html";
