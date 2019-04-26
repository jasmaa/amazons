// game logic

const cellState = {
    FIRE: -1,
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2,
    VALID: 3,
}

const gameState = {
    BLACK_IDLE: 0,
    BLACK_MOVING: 1,
    BLACK_FIRING: 2,
    WHITE_IDLE: 3,
    WHITE_MOVING: 4,
    WHITE_FIRING: 5,
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

        this.currRow = -1;
        this.currCol = -1;

        this.state = gameState.BLACK_IDLE;
    }

    /**
     * Raycast painting trail
     * @param {*} row 
     * @param {*} col 
     * @param {*} dirRow 
     * @param {*} dirCol 
     */
    raycast(row, col, dirRow, dirCol){
        row += dirRow;
        col += dirCol;

        while(row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length){
            
            if(this.board[row][col] != cellState.EMPTY){
                return;
            }
            this.board[row][col] = cellState.VALID;
            row += dirRow;
            col += dirCol;
        }
    }

    /**
     * Raycast in 8 directions
     * @param {*} row 
     * @param {*} col 
     */
    eightRaycast(row, col){
        this.raycast(row, col, 0, 1);
        this.raycast(row, col, 0, -1);
        this.raycast(row, col, 1, 0);
        this.raycast(row, col, -1, 0);
        this.raycast(row, col, -1, -1);
        this.raycast(row, col, -1, 1);
        this.raycast(row, col, 1, -1);
        this.raycast(row, col, 1, 1);
    }

    /**
     * Clears valid cells to empty
     */
    clearValid(){
        for(var i = 0; i < this.board.length; i++){
            for(var j = 0; j < this.board[0].length; j++){
                if(this.board[i][j] == cellState.VALID){
                    this.board[i][j] = cellState.EMPTY;
                }
            }
        }
    }

    /**
     * Selects a piece to move
     * @param {*} row 
     * @param {*} col 
     */
    choosePiece(row, col){
        // Black
        if(this.state == gameState.BLACK_IDLE){
            if(this.board[row][col] == cellState.BLACK){
                this.currRow = row;
                this.currCol = col;
                this.eightRaycast(row, col);
                this.state = gameState.BLACK_MOVING;
            }
        }
        // White
        if(this.state == gameState.WHITE_IDLE){
            if(this.board[row][col] == cellState.WHITE){
                this.currRow = row;
                this.currCol = col;
                this.eightRaycast(row, col);
                this.state = gameState.WHITE_MOVING;
            }
        }
    }

    /**
     * Selects move
     * @param {*} row 
     * @param {*} col 
     */
    chooseMove(row, col){
        if(this.state == gameState.BLACK_MOVING){
            if(this.board[row][col] == cellState.VALID){
                this.board[this.currRow][this.currCol] = cellState.EMPTY;
                this.board[row][col] = cellState.BLACK;
                this.clearValid();

                this.board.state = gameState.WHITE_IDLE;

            }
            else{
                this.clearValid();
                this.board.state = gameState.BLACK_IDLE;
            }
        }
        if(this.state == gameState.WHITE_MOVING){
            if(this.board[row][col] == cellState.VALID){
                this.board[this.currRow][this.currCol] = cellState.EMPTY;
                this.board[row][col] = cellState.WHITE;
                this.clearValid();

                this.board.state = gameState.BLACK_IDLE;

            }
            else{
                this.clearValid();
                this.board.state = gameState.WHITE_IDLE;
            }
        }
    }
}