function showForm() {
  // Ascunde butonul de sus
  document.getElementById("startBtn").style.display = "none";

  // Arată formularul cu nume
  document.getElementById("nameForm").style.display = "block";
}

function startGame() {
  let p1 = document.getElementById("player1").value;
  let p2 = document.getElementById("player2").value;

  if (p1 === "" || p2 === "") {
    alert("Introdu numele ambilor jucători!");
    return;
  }

  // Salvează numele jucătorilor
  localStorage.setItem("player1", p1);
  localStorage.setItem("player2", p2);

  // Redirecționează către pagina cu tabla jocului
  //   Urca 2 nivele
  window.location.href = "../../index.html";
}
