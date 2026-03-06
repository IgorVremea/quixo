const CONFIG = {
    canvas: {
        width: 600,
        height: 600,
        bgColor: '#e2e8f0'
    },
    cell: { 
        cellSize: 60,
        bgColor: '#FFF',
        bgColorArrow: '#000',
        get borderColor(){return CONFIG.canvas.bgColor;}, // Face o copie de valoare din canvas.bgColor sub nume borderColor
        borderColorHover: '#000',
        states: {
            NORMAL: 0,
            HOVER: 1
        },
        type: {
            PIECE: 0,
            ARROW: 1,
            EDGE: 2
        }
    },
    board: {
        boardScheme: [
            ['E',    '↓',    '↓',    '↓',    '↓',    '↓',    'E'],
            ['→',   'xo',   'xo',   'xo',   'xo',   'xo',   '←'],
            ['→',   'xo',   'xo',   'xo',   'xo',   'xo',   '←'],
            ['→',   'xo',   'xo',   'xo',   'xo',   'xo',   '←'],
            ['→',   'xo',   'xo',   'xo',   'xo',   'xo',   '←'],
            ['→',   'xo',   'xo',   'xo',   'xo',   'xo',   '←'],
            ['E',    '↑',    '↑',    '↑',    '↑',    '↑',    'E']
        ]
    }
};
