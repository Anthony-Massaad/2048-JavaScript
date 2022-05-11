/**
 * Tile Class that handles the Tiles properties and values
 */
export default class Tile{
    #tile;
    #x; 
    #y;
    #value;
    /**
     * Constructor for the tile class
     * @param {gameBoard} board, the gameboard html id main-game-container
     * @param {Integer} x, the column in which the tile will be located
     * @param {Integer} y, the row in which the tyle will be located
     * @param {Integer} value, the value of the tile that is being generated
     */
    constructor(board, x, y, value = Math.random() > 0.5 ? 2 : 4){
        this.#tile = document.createElement("div");
        this.#tile.classList.add("tile");
        this.#x = x;
        this.#y = y;
        this.#setValue(value);
        this.setProperties();
        board.append(this.#tile);
    }

    /**
     * Function for setting the x and y property of the tile 
     * which dicates its location on the board
     * i.e 0,0 is top left. 3,3 is bottom right
     */
    setProperties(){
        this.#tile.style.setProperty("--x", this.#x);
        this.#tile.style.setProperty("--y", this.#y);
    }

    /**
     * Function for setting the value of the tile 
     * Will set the value, and create the appropiate background and text color based on its value
     * the math is compeltely random and based on preference on what made it look the nicest. 
     * @param {Integer} value, the value of the tile 
     */
    #setValue(value){
        this.#value = value;
        this.#tile.textContent = value;
        const power = Math.log2(value);
        const backgroundLightness = 100 - power * 9;
        this.#tile.style.setProperty("--background-lightness", `${backgroundLightness}%`);
        this.#tile.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`);
    }
    
    /**
     * method for setting the x attribute
     */
    set x(value){
        this.#x = value;
    }

    /**
     * method for setting the y attribute
     */
    set y(value){
        this.#y = value;
    }

    /**
     * Method for getting the x attribute
     */
    get x(){
        return this.#x;
    }

    /**
     * method for getting the y attribute
     */
    get y(){
        return this.#y;
    }

    /**
     * method for getting the value of the tile
     */
    get value(){
        return this.#value; 
    }

    /**
     * method for getting the html tag of the tile
     */
    get tile(){
        return this.#tile;
    }
}
