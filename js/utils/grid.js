import Tile from "./tile.js";
import * as constants from "./const.js";

/**
 * Main Class for the grid 
 */
export default class Grid{
    #tiles;
    #boardMoves;
    #numberOfTiles;
    /**
     * Constructor for the grid class
     * @param {gameboard} board the gameboard html id main-game-container
     */
    constructor(board){
        board.style.setProperty("--cell-sizes", `${constants.CELL_SIZE}vmin`);
        board.style.setProperty("--grid-gap", `${constants.CELL_GAP}vmin`);
        board.style.setProperty("--grid-matrix", constants.GRID_SIZE);
        addSquareCells(board); // Add the default square cells around the board
        this.#numberOfTiles = 0;
        this.#tiles = [];
        // Initialize the tiles array with rows of undefines
        for (let i = 0; i<constants.GRID_SIZE; i++){
            var temp = [];
            for (let j = 0; j<constants.GRID_SIZE; j++){
                temp.push(undefined);
            }
            this.#tiles.push(temp);
        }
        this.#boardMoves = new Map();
        // initalize all possible moves on the board 
        for (var i = 0; i < constants.GRID_SIZE; i++){
            for (var j = 0; j < constants.GRID_SIZE; j++){
                const lst = [i, j];
                this.#boardMoves.set(lst.join(','), {x: i, y: j});
            }
        }
        // gemerate the starting tiles of the game
        for (var i = 0; i < constants.STARTING_TILES ; i++){
            this.generateTile(board);
        }   
    }

    /**
     * function for generating a new tile around the board
     * @param {gameboard} board the gameboard html id main-game-container
     * @returns dictionary of the position where the new tile is generated
     */
    generateTile(board){
        this.#generatePosition();
        const position = this.#generatePosition();
        this.#tiles[position.y][position.x] = new Tile(board, position.x, position.y);
        this.#numberOfTiles++;
        return position;
    }

    /**
     * functin for getting a tile based on its position on the board
     * @param {Integer} row, row of matrix 
     * @param {Integer} col, column of matrix 
     * @returns Tile, the tile in that posistion
     */
    getTileByPosition(row, col){
        return this.#tiles[row][col];
    }

    /**
     * function for checking if a position is undefined or not
     * @param {Integer} row, row of matrix 
     * @param {Integer} col, column of matrix 
     * @returns true if matrix position is undefined, otherwise false
     */
    tileLocationUndefined(row, col){
        return this.#tiles[row][col] === undefined;
    }

    /**
     * function for checking if the number of tiles is equal to the grid size power 2 
     * @returns true if there are no more spaces to add tiles, otherwise false
     */
    gameEndCheck(){
        return this.#numberOfTiles === constants.GRID_SIZE*constants.GRID_SIZE;
    }

    /**
     * Function for moving a tile across the board
     * @param {Integer} row, row of matrix 
     * @param {Integer} col, column of matrix 
     * @param {Integer} moveToRow, move to row of matrix
     * @param {Integer} moveToCol, move to col of matrix
     */
    movetiles(row, col, moveToRow, moveToCol){
        this.#tiles[moveToRow][moveToCol] = this.#tiles[row][col];
        this.#tiles[moveToRow][moveToCol].y = moveToRow;
        this.#tiles[moveToRow][moveToCol].x = moveToCol;
        this.#tiles[moveToRow][moveToCol].setProperties();
        this.#tiles[row][col] = undefined;
    }

    /**
     * Function for merging two tiles together
     * Will wait for transition of tiles before merging them together and 
     * creating a new tile of the combined numbers
     * @param {gameboard} gameBoard the gameboard html id main-game-container
     * @param {Integer} row, row of matrix 
     * @param {Integer} col, column of matrix 
     * @param {Tile} tile1, the first tile being merged
     * @param {Tile} tile2, the second tile being merged
     */
    mergeTiles(gameBoard, row, col, tile1, tile2){
        this.#tiles[row][col].tile.addEventListener("transitionend", () =>{
            tile1.tile.remove();
            tile2.tile.remove();
        });
        this.#tiles[row][col] = undefined;
        this.#tiles[row][col] = new Tile(gameBoard, col, row, tile1.value+tile2.value); 
        this.#numberOfTiles--;
    }

    /**
     * Function for comparing the values of two tiles
     * @param {Integer} row, row of matrix 
     * @param {Integer} col, column of matrix 
     * @param {Integer} comapreRow, the comparing row in the matrix
     * @param {Integer} compareCol, the comparing column in the matrix
     * @returns True if both tiles have the same value, otherwise false
     */
    compareValuesBetweenTwoTiles(row, col, comapreRow, compareCol){
        return this.#tiles[row][col].value === this.#tiles[comapreRow][compareCol].value;
    }

    /**
     * Function for generatinig a valid position in which a tile can be generated
     * @returns Dictionary, The positions in which a tile can be generated 
     */
    #generatePosition(){
        var cloneBoardMoves = new Map(this.#boardMoves);
        for (let i = 0; i<constants.GRID_SIZE; i++){
            for (let j = 0; j<constants.GRID_SIZE; j++){
                if (this.#tiles[i][j] !== undefined){
                    const lst = [this.#tiles[i][j].x, this.#tiles[i][j].y];
                    const joinedLst = lst.join(',');
                    cloneBoardMoves.delete(joinedLst); 
                } 
            }
        }
        const remainingValues = Array.from(cloneBoardMoves.values());
        return remainingValues[Math.floor(Math.random() * remainingValues.length)];
    }

}

/**
 * Function for initializing the square cells around the board based on the grid sizes
 * @param {gameboard} board the gameboard html id main-game-container
*/
function addSquareCells(board){
    for (var i = 0; i < constants.GRID_SIZE ** 2; i++){
        var cell = document.createElement("div");
        cell.classList.add("square-cell")
        board.append(cell);
    }
}
