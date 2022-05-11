import Grid from "./utils/grid.js";
import * as constants from "./utils/const.js";

// ** VARIABLE DECLARATIONS AND INITIALIZATIONS ** //
const gameBoard = document.getElementById("main-game-container");
const grid = new Grid(gameBoard);
const helpButton = document.getElementById("help");
const helpModal = document.getElementById("help-modal");
const exitHelpModal = document.getElementById("x-exit");
const scoreText = document.getElementById("score");
var score = 0;
// ** VARIABLE DECLARATIONS AND INITIALIZATIONS ** //

// Initialize Keyboard Input
setupInput();

// On click event for the help button (question mark on the top left)
helpButton.addEventListener("click", function(){
    helpModal.style.display = "block";
});

// on click event to exit the modal (X button on the top right of the help modal)
exitHelpModal.addEventListener("click", function(){
    helpModal.style.display = "none";
});

// Add key binding event listener to the window
function setupInput() {
    window.addEventListener("keydown", keyInput, { once: true })
}

/**
 * Handle function to manage the keyboard inputs.
 * If either of the cases are met, then handle input accordingly
 * Otherwise, go to default
 * @param {*} e, Event
 * @returns nothing
 */
function keyInput(e) {
    switch (e.key) {
      case "ArrowUp":
        if (!canMoveVertical(0, 1)){
            setupInput();
            return;
        }
        moveUp();
        break;
      case "ArrowDown":
        if (!canMoveVertical(constants.GRID_SIZE-1, -1)){
            setupInput();
            return;
        }
        moveDown();
        break
      case "ArrowLeft":
        if (!canMoveHorizontal(0, 1)){
            setupInput();
            return;
        }
        moveLeft();
        break;
      case "ArrowRight":
        if (!canMoveHorizontal(constants.GRID_SIZE-1, -1)){
            setupInput();
            return;
        }
        moveRight();
        break;
      default:
        setupInput();
        return;
    }
}

/**
 * Handle method for when the use hits the up arrow
 */
function moveUp(){
    slideTiles(true, 0, 1);
}

/**
 * Handle method for when the user hits the down arrow
 */
function moveDown(){
    slideTiles(true, constants.GRID_SIZE-1, -1);
}

/**
 * Handle method for when the user hits the right arrow
 */
function moveRight(){
    slideTiles(false, constants.GRID_SIZE-1, -1);
}

/**
 * handle method for when the user hits the left arrow
 */
function moveLeft(){
    slideTiles(false, 0, 1);
}

/**
 * function to handle the keyboard input of the user. Will move vertical or horizontal depending on the user input
 * @param {boolean} vertical, true if vertical, otherwise false 
 * @param {Integer} startingPoint, value in which the for loop starts
 * @param {Integer} direction, value in which the for loop increments/decrements 
 * @returns nothing
 */
function slideTiles(vertical, startingPoint, direction){
    if (vertical){
        verticalMovement(startingPoint, direction);
        return;
    }
    horizontalMovement(startingPoint, direction);
}

/**
 * General function for handling the vertical movements (up or down)
 * Takes in a starting point and direction in which the tiles move
 * @param {Integer} startingPoint, value in which the row for loop starts
 * @param {Integer} direction, value in which the for loop increments/decrements 
 */
function verticalMovement(startingPoint, direction){
    for (let row = startingPoint; row < constants.GRID_SIZE && row >= 0; row = row + direction){
        for (let col = 0; col < constants.GRID_SIZE; col++){
            if (!grid.tileLocationUndefined(row, col)){
                for (let iterateRows = row - direction; iterateRows < constants.GRID_SIZE && iterateRows >= 0; iterateRows = iterateRows - direction){
                    if (grid.tileLocationUndefined(iterateRows, col)){
                        grid.movetiles(iterateRows+direction, col, iterateRows, col);
                    }else{
                        if (grid.compareValuesBetweenTwoTiles(iterateRows+direction, col, iterateRows, col)){
                            var tile1 = grid.getTileByPosition(iterateRows+direction, col);
                            var tile2 = grid.getTileByPosition(iterateRows, col);
                            grid.movetiles(iterateRows+direction, col, iterateRows, col);
                            grid.mergeTiles(gameBoard, iterateRows, col, tile1, tile2);
                            incrementScore(tile1);
                        }
                        break;
                    }
                }
            }
        }
    }
    checkGameStatus();
}

/**
 * General function for handling the horiztonal movements (left or right)
 * Takes in a starting point and direction in which the tiles move
 * @param {Integer} startingPoint, value in which the col for loop starts
 * @param {Integer} direction, value in which the for loop increments/decrements 
 */
function horizontalMovement(startingPoint, direction){
    for (let row = 0; row < constants.GRID_SIZE; row++){
        for (let col = startingPoint; col < constants.GRID_SIZE && col >= 0; col = col + direction){
            if (!grid.tileLocationUndefined(row, col)){
                for (let iterateCols = col - direction; iterateCols < constants.GRID_SIZE && iterateCols >= 0; iterateCols = iterateCols - direction){
                    if (grid.tileLocationUndefined(row, iterateCols)){
                        grid.movetiles(row, iterateCols+direction, row, iterateCols);
                    }else{
                        if (grid.compareValuesBetweenTwoTiles(row, iterateCols+direction, row, iterateCols)){
                            var tile1 = grid.getTileByPosition(row, iterateCols+direction);
                            var tile2 = grid.getTileByPosition(row, iterateCols);
                            grid.movetiles(row, iterateCols+direction, row, iterateCols);
                            grid.mergeTiles(gameBoard, row, iterateCols, tile1, tile2);
                            incrementScore(tile1);
                        }
                        break;
                    }
                }
            }
        }
    }
    checkGameStatus();
}

/**
 * function for checking the game status before and after a new tile is added
 * otherwise allow user to input again 
 */
function checkGameStatus(){
    gameOverCheck();
    if (!grid.gameEndCheck()){
        const pos = grid.generateTile(gameBoard);
        grid.getTileByPosition(pos.y, pos.x).tile.addEventListener("animationend", () => {
            if (gameOverCheck()){ return; }
            setupInput();
        });
    }
}

/**
 * Function for checking if there are any possible moves
 * if not, add the finish animation status to all the tiles
 * @returns 
 */
function gameOverCheck(){
    if (!canMoveVertical(0, 1) && !canMoveVertical(constants.GRID_SIZE-1, -1) && !canMoveHorizontal(0, 1) && !canMoveHorizontal(constants.GRID_SIZE-1, -1)){
        for (let row = 0; row < constants.GRID_SIZE; row++){
            for (let col = 0; col<constants.GRID_SIZE; col++){
                grid.getTileByPosition(row, col).tile.style.animation = "finish 0.5s ease-in-out";
                grid.getTileByPosition(row, col).tile.style.animationDelay = `${(col+row)/10}s`;
            }
        }
        return true;
    }
    return false;
}

/**
 * handle method for incrementing the score based on the combining tile value
 * @param {Tile} tile, A tile
 */
function incrementScore(tile){
    score += tile.value;
    scoreText.textContent = score;
}

/**
 * function for checking if any tile on the game board can move in the horizontal directions
 * @param {Integer} startingPoint, value in which the col for loop starts
 * @param {Integer} direction, value in which the for loop increments/decrements 
 * @returns True if moving horizontal is possible, otherwise false
 */
function canMoveHorizontal(startingPoint, direction){
    for (let row = 0; row < constants.GRID_SIZE; row++){
        for (let col = startingPoint; col < constants.GRID_SIZE && col >= 0; col = col + direction){
            if (!grid.tileLocationUndefined(row, col)){
                for (let iterateCols = col - direction; iterateCols < constants.GRID_SIZE && iterateCols >= 0; iterateCols = iterateCols - direction){
                    if (grid.tileLocationUndefined(row, iterateCols)){
                        return true;
                    }else{
                        if (grid.compareValuesBetweenTwoTiles(row, iterateCols+direction, row, iterateCols)){
                            return true;
                        }
                        break;
                    }
                }
            }
        }
    }
    return false; 
}

/**
 * function for checking if any tile on the game board can move in the vertical directions
 * @param {Integer} startingPoint, value in which the row for loop starts
 * @param {Integer} direction, value in which the for loop increments/decrements 
 * @returns True if moving vertical is possible, otherwise false
 */
function canMoveVertical(startingPoint, direction){
    for (let row = startingPoint; row < constants.GRID_SIZE && row >= 0; row = row + direction){
        for (let col = 0; col < constants.GRID_SIZE; col++){
            if (!grid.tileLocationUndefined(row, col)){
                for (let iterateRows = row - direction; iterateRows < constants.GRID_SIZE && iterateRows >= 0; iterateRows = iterateRows - direction){
                    if (grid.tileLocationUndefined(iterateRows, col)){
                        return true;
                    }else{
                        if (grid.compareValuesBetweenTwoTiles(iterateRows+direction, col, iterateRows, col)){
                            return true;
                        }
                        break;
                    }
                }
            }
        }
    }
    return false;
}
