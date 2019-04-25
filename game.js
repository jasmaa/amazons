// game logic

const cellState = {
    FIRE: -1,
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2,
}

// Amazons game
class Amazons{

    constructor(){
        // init board
        this.board = [...Array(10)].map(e => Array(10).fill(cellState.EMPTY));
        this.board[0][3] = cellState.BLACK;
        this.board[0][6] = cellState.BLACK;
        this.board[3][0] = cellState.BLACK;
        this.board[3][9] = cellState.BLACK;
        this.board[6][0] = cellState.WHITE;
        this.board[6][9] = cellState.WHITE;
        this.board[9][3] = cellState.WHITE;
        this.board[9][6] = cellState.FIRE;

        this.playerTurn = cellState.WHITE;
    }
}