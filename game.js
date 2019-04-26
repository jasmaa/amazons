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
        this.board[9][6] = cellState.WHITE;

        this.currRow = -1;
        this.currCol = -1;
        this.prevRow = -1;
        this.prevCol = -1;

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
        var count = 0;
        row += dirRow;
        col += dirCol;

        while(row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length){
            
            if(this.board[row][col] != cellState.EMPTY){
                break;
            }
            this.board[row][col] = cellState.VALID;
            count++;
            row += dirRow;
            col += dirCol;
        }

        return count;
    }

    /**
     * Raycast in 8 directions
     * @param {*} row 
     * @param {*} col 
     */
    eightRaycast(row, col){
        var count = 0;

        count += this.raycast(row, col, 0, 1);
        count += this.raycast(row, col, 0, -1);
        count += this.raycast(row, col, 1, 0);
        count += this.raycast(row, col, -1, 0);
        count += this.raycast(row, col, -1, -1);
        count += this.raycast(row, col, -1, 1);
        count += this.raycast(row, col, 1, -1);
        count += this.raycast(row, col, 1, 1);

        return count;
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
        var playingMoving, playingColor;
        if(this.state == gameState.BLACK_IDLE){
            playingMoving = gameState.BLACK_MOVING;
            playingColor = cellState.BLACK;
        }
        else if(this.state == gameState.WHITE_IDLE){
            playingMoving = gameState.WHITE_MOVING;
            playingColor = cellState.WHITE;
        }
        else{
            return;
        }

        if(this.board[row][col] == playingColor){
            if(this.eightRaycast(row, col) > 0){
                this.prevRow = row;
                this.prevCol = col;
                this.state = playingMoving;
            }
        }
    }

    /**
     * Selects move
     * @param {*} row 
     * @param {*} col 
     */
    chooseMove(row, col){
        var playingFiring, playingColor, playingIdle;
        if(this.state == gameState.BLACK_MOVING){
            playingIdle = gameState.BLACK_IDLE;
            playingColor = cellState.BLACK;
            playingFiring = gameState.BLACK_FIRING;
        }
        else if(this.state == gameState.WHITE_MOVING){
            playingIdle = gameState.WHITE_IDLE;
            playingColor = cellState.WHITE;
            playingFiring = gameState.WHITE_FIRING;
        }
        else{
            return;
        }

        if(this.board[row][col] == cellState.VALID){
            this.board[this.prevRow][this.prevCol] = cellState.EMPTY;
            this.board[row][col] = playingColor;
            this.currRow = row;
            this.currCol = col;
            this.clearValid();

            this.eightRaycast(row, col);
            this.state = playingFiring;
        }
        else{
            this.clearValid();
            this.state = playingIdle;
        }
        
    }

    /**
     * Selects location to fire
     * @param {*} row 
     * @param {*} col 
     */
    chooseFire(row, col){
        var opponentIdle, playingColor, playingIdle;
        if(this.state == gameState.BLACK_FIRING){
            opponentIdle = gameState.WHITE_IDLE;
            playingIdle = gameState.BLACK_IDLE;
            playingColor = cellState.BLACK;
        }
        else if(this.state == gameState.WHITE_FIRING){
            opponentIdle = gameState.BLACK_IDLE;
            playingIdle = gameState.WHITE_IDLE;
            playingColor = cellState.WHITE;
        }
        else{
            return;
        }

        if(this.board[row][col] == cellState.VALID){
            this.board[row][col] = cellState.FIRE;
            this.clearValid();

            this.state = opponentIdle;
        }
        else{
            this.clearValid();
            this.board[this.currRow][this.currCol] = cellState.EMPTY;
            this.board[this.prevRow][this.prevCol] = playingColor;
            this.state = playingIdle;
        }
    }
}