// Computer player

/**
 * Selects a random move
 */
/**
 * Agent that selects random valid moves
 */
 class RandomPlayer{

    constructor(color, amazons){
        this.color = color;
        this.amazons = amazons;
    }

    nextMove(){
        var possible, move;
        
        // Choose piece
        possible = this.amazons.findPositions(this.color);
        var i = Math.floor(possible.length * Math.random());
        move = possible[i];
        while(this.amazons.eightRaycast(move[0], move[1], false) <= 0){
            i = (i + 1) % possible.length;
            move = possible[i];
        }
        this.amazons.choosePiece(move[0], move[1]);

        // Choose move
        possible = this.amazons.findPositions(cellState.VALID);
        move = possible[Math.floor(possible.length * Math.random())];
        this.amazons.chooseMove(move[0], move[1]);
        
        // Choose fire
        possible = this.amazons.findPositions(cellState.VALID);
        move = possible[Math.floor(possible.length * Math.random())];
        this.amazons.chooseFire(move[0], move[1]);
    }
}

class AIPlayer{

    constructor(color, amazons){
        this.color = color;
        this.amazons = amazons;
    }

    nextMove(){
        var bestClone;
        var bestScore = 0;

        // copy current board
        var boardPieceClone = this.amazons.clone();
        var possiblePieces = boardPieceClone.findPositions(this.color);
        for(let pieceChoice of possiblePieces){
            boardPieceClone.choosePiece(pieceChoice[0], pieceChoice[1]);
            
            var boardMoveClone = boardPieceClone.clone();
            var possibleMoves = boardMoveClone.findPositions(cellState.VALID);
            for(let moveChoice of possibleMoves){
                boardMoveClone.chooseMove(moveChoice[0], moveChoice[1]);
                
                var boardFireClone = boardMoveClone.clone();
                var possibleFires = boardFireClone.findPositions(cellState.VALID);
                for(let fireChoice of possibleFires){
                    boardFireClone.chooseFire(fireChoice[0], fireChoice[1]);
                    
                    // random score for now
                    var score = Math.random();
                    if(score > bestScore){
                        bestClone = boardFireClone;
                        bestScore = score;
                    }

                    // restore old amazons
                    boardFireClone = boardMoveClone.clone();
                }

                // restore old amazons
                boardMoveClone = boardPieceClone.clone();
            }

            // restore old amazons
            boardPieceClone = this.amazons.clone();
        }

        // copy over values
        this.amazons.board = bestClone.board;
        this.amazons.moves = bestClone.moves;
        this.amazons.state = bestClone.state;

        this.relativeTerritory();
    }


    /**
     * Relative territory of current board
     * Scores range 101-200 with black trying to max and white trying to min
     */
    relativeTerritory(){
        var blackScoreBoard = this.amazons.board.map(arr => arr.slice());
        var whiteScoreBoard = this.amazons.board.map(arr => arr.slice());

        // Black max, white min
        var score = 0;

        // init scores
        for(var i = 0; i < this.amazons.board.length; i++){
            for(var j = 0; j < this.amazons.board[i].length; j++){
                if(this.amazons.board[i][j] == cellState.BLACK){
                    this.relativeTerritoryAux(blackScoreBoard, i, j, 200);
                }
                if(this.amazons.board[i][j] == cellState.WHITE){
                    this.relativeTerritoryAux(whiteScoreBoard, i, j, 200);
                }
            }
        }

        // compare and eval boards
        // a cell is black or white's if they can get to it faster, neutral otherwise
        for(var i = 0; i < this.amazons.board.length; i++){
            for(var j = 0; j < this.amazons.board[i].length; j++){
                if(blackScoreBoard[i][j] > whiteScoreBoard[i][j]){
                    score++;
                }
                else if(blackScoreBoard[i][j] < whiteScoreBoard[i][j]){
                    score--;
                }
            }
        }

        print2DArray(blackScoreBoard);
        console.log(score);
        return score;
    }
    
    /**
     * Recursive aux for relative territory
     * @param {*} board 
     * @param {*} row 
     * @param {*} col 
     * @param {*} currScore 
     */
    relativeTerritoryAux(board, row, col, currScore){

        board[row][col] = currScore;

        var hitList = eightRaycast(board, row, col);
        for(var coord of hitList){
            if(board[coord[0]][coord[1]] < currScore - 1){
                this.relativeTerritoryAux(board, coord[0], coord[1], currScore - 1);
            }
        }
    }

}

function print2DArray(arr){
    var count = 0;
    for(row of arr){
        console.log(count + ": " + row);
        count++;
    }
}