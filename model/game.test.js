import {Game} from "./game";
import {GameStatuses} from "./game-statuses";
import {ShogunNumberUtility} from "./shogun-number-utility";
import {moveDirections} from "./moveDirections";

describe('game', () => {
    it('game should be created and return status', () => {
        const numberUtil = new ShogunNumberUtility()
        const game = new Game(numberUtil)
        expect(game.status).toBe(GameStatuses.SETTINGS);
    })

    it('game should be created and return status', async () => {
        const numberUtil = new ShogunNumberUtility()
        const game = new Game(numberUtil)
        await game.start();
        expect(game.status).toBe(GameStatuses.IN_PROGRESS);
    })

    it('google should be in the Grid after start', async () => {
        const numberUtil = new ShogunNumberUtility()

        for(let i=0; i < 100; i++) {
            const game = new Game(numberUtil)
            expect(game.googlePosition).toBeNull();
            await game.start()
            expect(game.googlePosition.x).toBeLessThan(game.gridSize.columnsCount)
            expect(game.googlePosition.x).toBeGreaterThanOrEqual(0)
            expect(game.googlePosition.y).toBeLessThan(game.gridSize.rowsCount)
            expect(game.googlePosition.y).toBeGreaterThanOrEqual(0)
        }
    })

    it('google should be in the Grid but in new position after jump', async () => {
        const numberUtil = new ShogunNumberUtility()
        const game = new Game(numberUtil)
        game.googleJumpInterval = 1; // ms
        game.googlePointsForWin = 200
        await game.start() // jump -> webAPI/browser 10

        for (let i = 0; i < 100; i++) {
            const prevGooglePosition = game.googlePosition;
            await delay(1) // await -> webAPI/browser 10 // after 10 ms: macrotasks: [jump, await]
            const currentGooglePosition = game.googlePosition;
            expect(prevGooglePosition).not.toEqual(currentGooglePosition)
        }
    })

    it('player1 should be in the Grid after start', async () => {
        const numberUtil = new ShogunNumberUtility()

        for(let i=0; i < 100; i++) {
            const game = new Game(numberUtil)
            expect(game.player1Position).toBeNull();
            await game.start()
            expect(game.player1Position.x).toBeLessThan(game.gridSize.columnsCount)
            expect(game.player1Position.x).toBeGreaterThanOrEqual(0)
            expect(game.player1Position.y).toBeLessThan(game.gridSize.rowsCount)
            expect(game.player1Position.y).toBeGreaterThanOrEqual(0)
        }
    })

    it('the positions of the players must not coincide', async () => {
        const numberUtil = new ShogunNumberUtility()

        for(let i=0; i < 100; i++) {
            const game = new Game(numberUtil)
            expect(game.player1Position).toBeNull();
            expect(game.player2Position).toBeNull();
            await game.start()
            expect(game.player2Position).not.toEqual(game.player1Position)
        }
    })

    it('player2 should be in the Grid after start', async () => {
        const numberUtil = new ShogunNumberUtility()

        for(let i=0; i < 100; i++) {
            const game = new Game(numberUtil)
            expect(game.player2Position).toBeNull();
            await game.start()
            expect(game.player2Position.x).toBeLessThan(game.gridSize.columnsCount)
            expect(game.player2Position.x).toBeGreaterThanOrEqual(0)
            expect(game.player2Position.y).toBeLessThan(game.gridSize.rowsCount)
            expect(game.player2Position.y).toBeGreaterThanOrEqual(0)
        }
    })

    it('player should be move in correct directions', async () => {
        //const numberUtil = new ShogunNumberUtility()

        const fakeNumberUtility = {
            *numberGenerator() {
                    yield 2;
                    yield 2;
                    yield 1;
                    yield 1;
                    yield 0;
                    yield 0;
                    while(true) {
                        yield 0;
                    }
            },
            iterator: null,
            getRandomIntegerNumber(from, to) {
                if (!this.iterator) {
                    this.iterator = this.numberGenerator();
                }
                return this.iterator.next().value;
            }
        };

        const game = new Game(fakeNumberUtility)
        game.gridSize = {columnsCount: 3, rowsCount: 3}
        game.start()

        // [  ][  ][  ]
        // [  ][p2][  ]
        // [  ][  ][p1]
        expect(game.player1Position).toEqual({x: 2, y: 2})
        expect(game.player2Position).toEqual({x: 1, y: 1})

        // [  ][  ][  ]
        // [  ][  ][p2]
        // [  ][  ][p1]

        game.movePlayer(1, moveDirections.RIGHT)
        expect(game.player1Position).toEqual({x: 2, y: 2})
        game.movePlayer(2, moveDirections.RIGHT)
        expect(game.player2Position).toEqual({x: 2, y: 1})

        // [  ][  ][  ]
        // [  ][  ][p2]
        // [  ][  ][p1]

        game.movePlayer(1, moveDirections.DOWN)
        expect(game.player1Position).toEqual({x: 2, y: 2})
        game.movePlayer(2, moveDirections.DOWN)
        expect(game.player2Position).toEqual({x: 2, y: 1})


        // [  ][  ][p2]
        // [  ][  ][  ]
        // [  ][  ][p1]
        game.movePlayer(1, moveDirections.UP)
        expect(game.player1Position).toEqual({x: 2, y: 2})
        game.movePlayer(2, moveDirections.UP)
        expect(game.player2Position).toEqual({x: 2, y: 0})


        // [  ][  ][p2]
        // [  ][  ][p1]
        // [  ][  ][  ]
        game.movePlayer(1, moveDirections.UP)
        expect(game.player1Position).toEqual({x: 2, y: 1})
        game.movePlayer(2, moveDirections.UP)
        expect(game.player2Position).toEqual({x: 2, y: 0})


        // [  ][p2][  ]
        // [  ][p1][  ]
        // [  ][  ][  ]
        game.movePlayer(1, moveDirections.LEFT)
        expect(game.player1Position).toEqual({x: 1, y: 1})
        game.movePlayer(2, moveDirections.LEFT)
        expect(game.player2Position).toEqual({x: 1, y: 0})


        // [  ][p2][  ]
        // [  ][p1][  ]
        // [  ][  ][  ]
        game.movePlayer(1, moveDirections.UP)
        expect(game.player1Position).toEqual({x: 1, y: 1})
        game.movePlayer(2, moveDirections.UP)
        expect(game.player2Position).toEqual({x: 1, y: 0})


        // [p2][  ][  ]
        // [p1][  ][  ]
        // [  ][  ][  ]
        game.movePlayer(1, moveDirections.LEFT)
        expect(game.player1Position).toEqual({x: 0, y: 1})
        game.movePlayer(2, moveDirections.LEFT)
        expect(game.player2Position).toEqual({x: 0, y: 0})


        // [  ][  ][  ]
        // [p2][  ][  ]
        // [p1][  ][  ]
        game.movePlayer(1, moveDirections.DOWN)
        expect(game.player1Position).toEqual({x: 0, y: 2})
        game.movePlayer(2, moveDirections.DOWN)
        expect(game.player2Position).toEqual({x: 0, y: 1})


        // [  ][  ][  ]
        // [  ][p2][  ]
        // [  ][p1][  ]
        game.movePlayer(1, moveDirections.RIGHT)
        expect(game.player1Position).toEqual({x: 1, y: 2})
        game.movePlayer(2, moveDirections.RIGHT)
        expect(game.player2Position).toEqual({x: 1, y: 1})

    })

})

// промисификация setTimeout
const delay = (ms) => new Promise((res, rej) => setTimeout(res, ms))
