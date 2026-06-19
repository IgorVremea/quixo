const CONFIG = {
  canvas: {
    get width() {
      return document.getElementById("game-div").offsetWidth;
    },
    get height() {
      return CONFIG.canvas.width;
    },
    get bgColor() {
      return window.getComputedStyle(document.querySelector("body"))
        .backgroundColor;
    },
  },
  cell: {
    get cellSize() {
      return CONFIG.canvas.width / 9;
    },
    bgColor: "#FFF",
    bgColorArrow: "#000",
    get borderColor() {
      return CONFIG.canvas.bgColor;
    }, // Face o copie de valoare din canvas.bgColor sub nume borderColor
    borderColorHover: "#000",
    states: {
      NORMAL: 0,
      HOVER: 1,
    },
    type: {
      PIECE: 0,
      ARROW: 1,
      EDGE: 2,
    },
  },

  animationCellSelected: {
    duration: 600,
  },

  board: {
    boardScheme: [
      ["E", "↓", "↓", "↓", "↓", "↓", "E"],
      ["→", "xo", "xo", "xo", "xo", "xo", "←"],
      ["→", "xo", "xo", "xo", "xo", "xo", "←"],
      ["→", "xo", "xo", "xo", "xo", "xo", "←"],
      ["→", "xo", "xo", "xo", "xo", "xo", "←"],
      ["→", "xo", "xo", "xo", "xo", "xo", "←"],
      ["E", "↑", "↑", "↑", "↑", "↑", "E"]
      // ["E", "↓", "↓", "↓", "↓", "↓", "E"],
      // ["→", "x", "x", "x", "x", "xo", "←"],
      // ["→", "xo", "xo", "xo", "xo", "xo", "←"],
      // ["→", "xo", "xo", "xo", "xo", "xo", "←"],
      // ["→", "xo", "xo", "xo", "xo", "xo", "←"],
      // ["→", "o", "o", "o", "o", "xo", "←"],
      // ["E", "↑", "↑", "↑", "↑", "↑", "E"]
    ],
    direction: {
      DOWN: 0,
      LEFT: 1,
      UP: 2,
      RIGHT: 3,
    },
  },
};
export default CONFIG;
