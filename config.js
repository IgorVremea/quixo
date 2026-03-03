const CONFIG = {
    canvas: {
        width: 400,
        height: 400,
        bgColor: '#e2e8f0'
    },
    cell: { 
        cellSize: 60,
        bgColor: '#FFF',
        get borderColor(){return CONFIG.canvas.bgColor;}, // Face o copie de valoare din canvas.bgColor sub nume borderColor
        borderColorHover: '#000'
    }
    
};

const NORMAL = 0;
const HOVER = 1;