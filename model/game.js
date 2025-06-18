import {GameStatuses} from "./game-statuses.js";
import {moveDirections} from "./moveDirections.js";

export class Game {
    #status = GameStatuses.SETTINGS
    #googleCountPoints = 0

    #positions = {
        googlePosition: null,
        player1Position: null,
        player2Position: null,
    }

    #numberUtility;

    // DI/DependencyInjection
    constructor(somethingSimilarToNumberUtility) {
        this.#numberUtility = somethingSimilarToNumberUtility; // must have getRandomIntegerNumber method
    }

    #settings = {
        gridSize: new GridSize(5, 5),
        googleJumpInterval: 1000,
        googlePointsForWin: 10
    }

    #observers =  []
    subscribe(observer){
        this.#observers.push(observer);
    }

    #notify(){
        this.#observers.forEach(o=>o())
    }

    /**
     * Sets the Google jump interval for the settings.
     *
     * @param {number} newValue - The new interval value to set. Must be a positive number.
     * @throws {TypeError} If newValue is not a number.
     * @throws {TypeError} If newValue is less than or equal to 0.
     */
    set googleJumpInterval(newValue) {
        if (typeof newValue !== 'number') {
            throw new TypeError('Arguments must be numbers');
        }
        if (newValue <= 0) {
            throw new TypeError('Interval must be numbers');
        }
        this.#settings.googleJumpInterval = newValue

        this.#notify()
    }

    set googlePointsForWin(newValue) {
       this.#settings.googlePointsForWin = newValue
    }

    start() {

        if (this.#status !== GameStatuses.SETTINGS) {
            throw new Error('Game must be in Settings before Start')
        }
        this.#status = GameStatuses.IN_PROGRESS

        this.#placePlayer1ToGrid();
        this.#placePlayer2ToGrid();
        this.#makeGoogleJump();

        this.#notify()
        const intervalId = setInterval(() => {
            if(this.#status === GameStatuses.WIN){

                return  clearInterval(intervalId)
            }
            this.#makeGoogleJump();
            this.#googleCountPoints += 1;
            console.log(this.#googleCountPoints)
            this.#notify()

            if (this.#googleCountPoints === this.#settings.googlePointsForWin) {
                this.#status = GameStatuses.LOSE
                clearInterval(intervalId)
            }

            this.#notify()
        }, this.#settings.googleJumpInterval)


    }
    playAgain (){
        this.#status = GameStatuses.SETTINGS
        this.start()
    }

    #placePlayerToGrid() {
        return {
            x: this.#numberUtility.getRandomIntegerNumber(0, this.#settings.gridSize.columnsCount),
            y: this.#numberUtility.getRandomIntegerNumber(0, this.#settings.gridSize.rowsCount),
        }
    }

    #placePlayer1ToGrid() {
        this.#positions['player1Position'] = this.#placePlayerToGrid()
    }

    #placePlayer2ToGrid() {
        const newPosition = this.#placePlayerToGrid()
        if (newPosition.x === this.player1Position?.x && newPosition.y === this.player1Position?.y) {
            this.#placePlayer2ToGrid()
            return;
        }
        this.#positions['player2Position'] = newPosition
    }

    #makeGoogleJump() {
        const newPosition = {
            x: this.#numberUtility.getRandomIntegerNumber(0, this.#settings.gridSize.columnsCount),
            y: this.#numberUtility.getRandomIntegerNumber(0, this.#settings.gridSize.rowsCount),
        }
        if (
            newPosition.x === this.googlePosition?.x && newPosition.y === this.googlePosition?.y
            ||
            newPosition.x === this.player1Position?.x && newPosition.y === this.player1Position?.y
            ||
            newPosition.x === this.player2Position?.x && newPosition.y === this.player2Position?.y
        ) {
            this.#makeGoogleJump()
            return;
        }
        this.#positions['googlePosition'] = newPosition
    }

    get status() {
        return this.#status
    }

    get googleCountPoints() {
        return this.#googleCountPoints
    }

    get googlePosition() {
        return this.#positions['googlePosition']
    }

    get player1Position() {
        return this.#positions['player1Position']
    }

    get player2Position() {
        return this.#positions['player2Position']
    }

    get gridSize() {
        return this.#settings.gridSize
    }

    //JSDoc
    /**
     * Sets the grid size for the game.
     *
     * @param {GridSize} value - The new grid size to set.
     */
    set gridSize(value) {
        this.#settings.gridSize = value
        this.#notify()
    }

    movePlayer(playerNumber, moveDirection) {
        const position = this.#positions['player' + playerNumber + 'Position']
        let newPosition;
        switch (moveDirection) {
            case moveDirections.UP: {
                newPosition = {
                    x: position.x,
                    y: position.y - 1
                }
                break;
            }
            case moveDirections.DOWN: {
                newPosition = {
                    x: position.x,
                    y: position.y + 1
                }
                break;
            }
            case moveDirections.LEFT: {
                newPosition = {
                    x: position.x - 1,
                    y: position.y
                }
                break;
            }
            case moveDirections.RIGHT: {
                newPosition = {
                    x: position.x + 1,
                    y: position.y
                }
                break;
            }
        }


        if (
            newPosition.x >= this.gridSize.columnsCount ||
            newPosition.x < 0 ||
            newPosition.y >= this.gridSize.rowsCount ||
            newPosition.y < 0
        ) {
            return;
        }
        if (
            playerNumber === 1 &&
            newPosition.x === this.player2Position.x &&
            newPosition.y === this.player2Position.y
        ) {
            return;
        }
        if (
            playerNumber === 2 &&
            newPosition.x === this.player1Position.x &&
            newPosition.y === this.player1Position.y
        ) {
            return;
        }

        this.#positions['player' + playerNumber + 'Position'] = newPosition

        this.#notify()

        if (
            this.#positions['player' + playerNumber + 'Position'].x
            === this.#positions['googlePosition'].x &&
            this.#positions['player' + playerNumber + 'Position'].y
            === this.#positions['googlePosition'].y
        ) {
            this.#status = GameStatuses.WIN
            this.#notify()
        }
    }
}

class GridSize {
    constructor(rowsCount = 5, columnsCount = 5) {
        this.rowsCount = rowsCount;
        this.columnsCount = columnsCount;
    }
}

