let controller;
let board;

function setup() {
  createCanvas(CONFIG.canvas.width, CONFIG.canvas.height);
  controller = new Controller(new Board());
}

function draw() {
  controller.tick();
  RB.drawButton();
}

function mousePressed() {
  RB.mousePressedButton();
  let clickedCell = controller.board.getHoveredCell();
  controller.cellClick(clickedCell);
  }


window.startGame = function(){
    if(!controller){
        console.log("Controller nu e încă gata!");
        return;
    }

    controller.players.x = document.getElementById("playerX").value || "Player X";
    controller.players.o = document.getElementById("playerO").value || "Player O";

    document.getElementById("menu").style.display = "none";
}