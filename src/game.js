// Game logic

export const cellState = {
    FIRE: -1,
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2,
    VALID: 3,
}

export const gameState = {
    BLACK_IDLE: 0,
    BLACK_MOVING: 1,
    BLACK_FIRING: 2,
    WHITE_IDLE: 3,
    WHITE_MOVING: 4,
    WHITE_FIRING: 5,
    BLACK_WIN: 6,
    WHITE_WIN: 7,
}

/**
 * Amazons game model
 */
export class Amazons {

    constructor() {
        this.reset();
    }

    /**
     * Resets the board
     */
    reset() {
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

        this.moves = [];

        this.state = gameState.BLACK_IDLE;
    }

    /**
     * Clears valid cells to empty
     */
    clearValid() {
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] == cellState.VALID) {
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
    choosePiece(row, col) {
        // Black
        var playingMoving, playingColor;
        if (this.state == gameState.BLACK_IDLE) {
            playingMoving = gameState.BLACK_MOVING;
            playingColor = cellState.BLACK;
        }
        else if (this.state == gameState.WHITE_IDLE) {
            playingMoving = gameState.WHITE_MOVING;
            playingColor = cellState.WHITE;
        }
        else {
            return false;
        }

        if (this.board[row][col] == playingColor) {
            // mark valid
            var validList = eightRaycast(this.board, row, col);
            for (var coords of validList) {
                this.board[coords[0]][coords[1]] = cellState.VALID;
            }

            if (validList.length > 0) {
                this.prevRow = row;
                this.prevCol = col;
                this.state = playingMoving;
                return true
            }
        }

        return false;
    }

    /**
     * Selects move
     * @param {*} row 
     * @param {*} col 
     */
    chooseMove(row, col) {
        var playingFiring, playingColor, playingIdle;
        if (this.state == gameState.BLACK_MOVING) {
            playingIdle = gameState.BLACK_IDLE;
            playingColor = cellState.BLACK;
            playingFiring = gameState.BLACK_FIRING;
        }
        else if (this.state == gameState.WHITE_MOVING) {
            playingIdle = gameState.WHITE_IDLE;
            playingColor = cellState.WHITE;
            playingFiring = gameState.WHITE_FIRING;
        }
        else {
            return false;
        }

        if (this.board[row][col] == cellState.VALID) {
            this.board[this.prevRow][this.prevCol] = cellState.EMPTY;
            this.board[row][col] = playingColor;
            this.currRow = row;
            this.currCol = col;
            this.clearValid();

            // mark valid
            var validList = eightRaycast(this.board, row, col);
            for (var coords of validList) {
                this.board[coords[0]][coords[1]] = cellState.VALID;
            }


            this.state = playingFiring;
            return true;
        }
        else {
            this.clearValid();
            this.state = playingIdle;
        }

        return false;
    }

    /**
     * Selects location to fire
     * @param {*} row 
     * @param {*} col 
     */
    chooseFire(row, col) {
        var opponentIdle, playingColor, playingIdle;
        if (this.state == gameState.BLACK_FIRING) {
            opponentIdle = gameState.WHITE_IDLE;
            playingIdle = gameState.BLACK_IDLE;
            playingColor = cellState.BLACK;
        }
        else if (this.state == gameState.WHITE_FIRING) {
            opponentIdle = gameState.BLACK_IDLE;
            playingIdle = gameState.WHITE_IDLE;
            playingColor = cellState.WHITE;
        }
        else {
            return false;
        }

        if (this.board[row][col] == cellState.VALID) {
            this.board[row][col] = cellState.FIRE;
            this.clearValid();

            // update move table
            this.moves.push(
                this.positionToNotation(this.prevRow, this.prevCol) +
                this.positionToNotation(this.currRow, this.currCol) +
                "(" + this.positionToNotation(row, col) + ")"
            );

            this.state = opponentIdle;

            return true;
        }
        else {
            this.clearValid();
            this.board[this.currRow][this.currCol] = cellState.EMPTY;
            this.board[this.prevRow][this.prevCol] = playingColor;
            this.state = playingIdle;
        }

        return false;
    }

    /**
     * Detects end of game
     * @param {Losing player} playerColor 
     */
    detectEnd(playerColor) {
        var count = 0;
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] == playerColor) {
                    count += eightRaycast(this.board, i, j).length;
                }
            }
        }

        // Set win state
        if (count == 0) {
            switch (playerColor) {
                case cellState.BLACK:
                    this.state = gameState.WHITE_WIN;
                    break;
                case cellState.WHITE:
                    this.state = gameState.BLACK_WIN;
                    break;
            }
        }
    }

    /**
     * Gets name of current state
     */
    getStateName() {
        switch (this.state) {
            case gameState.BLACK_IDLE:
                return "Black's turn";
            case gameState.BLACK_MOVING:
                return "Choosing black move";
            case gameState.BLACK_FIRING:
                return "Choosing black fire";
            case gameState.WHITE_IDLE:
                return "White's turn";
            case gameState.WHITE_MOVING:
                return "Choosing white move";
            case gameState.WHITE_FIRING:
                return "Choosing white fire";
            case gameState.BLACK_WIN:
                return "Black wins";
            case gameState.WHITE_WIN:
                return "White wins";
        }
    }

    /**
     * Converts row, col to notation
     */
    positionToNotation(row, col) {
        return String.fromCharCode(col + 97) + (this.board.length - row);
    }

    /**
     * Find pieces of a specified state
     * @param {*} state 
     */
    findPositions(state) {
        var pieces = [];

        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] == state) {
                    pieces.push([i, j]);
                }
            }
        }

        return pieces;
    }

    /**
     * Makes a deep clone of the object
     */
    clone() {
        var amazonsClone = new Amazons();
        amazonsClone.board = this.board.map(arr => arr.slice());
        amazonsClone.currRow = this.currRow;
        amazonsClone.currCol = this.currCol;
        amazonsClone.prevRow = this.prevRow;
        amazonsClone.prevCol = this.prevCol;
        amazonsClone.moves = this.moves.slice();
        amazonsClone.state = this.state;
        return amazonsClone;
    }
}


/**
 * Raycast
 * @param {*} board 
 * @param {*} row 
 * @param {*} col 
 * @param {*} dirRow 
 * @param {*} dirCol 
 */
function raycast(board, row, col, dirRow, dirCol) {
    var hitList = [];
    row += dirRow;
    col += dirCol;

    while (row >= 0 && row < board.length && col >= 0 && col < board[0].length) {

        // break if in blacklist
        if ([cellState.FIRE, cellState.WHITE, cellState.BLACK].includes(board[row][col])) {
            break;
        }

        hitList.push([row, col]);
        row += dirRow;
        col += dirCol;
    }

    return hitList;
}

/**
 * Raycast in eight directions
 * @param {*} board 
 * @param {*} row 
 * @param {*} col 
 */
export function eightRaycast(board, row, col) {
    var hitList = [];

    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (i != 0 || j != 0) {
                hitList = hitList.concat(raycast(board, row, col, i, j));
            }
        }
    }

    return hitList;
}