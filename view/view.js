import {GameStatuses} from "../model/game-statuses.js";
import {moveDirections} from "../model/moveDirections.js";

export class View {

    onstart = null
    onplayermove = null
    restart = null

    constructor() {
        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'ArrowUp':
                    this.onplayermove?.(1, moveDirections.UP)
                    break
                case 'ArrowDown':
                    this.onplayermove?.(1, moveDirections.DOWN)
                    break
                case 'ArrowRight':
                    this.onplayermove?.(1, moveDirections.RIGHT)
                    break
                case 'ArrowLeft':
                    this.onplayermove?.(1, moveDirections.LEFT)
                    break
                default:
                    return
            }
        })

    }

    render(dto) {
        const winModal = document.querySelector('.modal.win');
        const loseModal = document.querySelector('.modal.lose');
        const gameGrid = document.querySelector('.table');

        // Обновляем счетчики
        const catchEl = winModal.querySelector('.result-block:nth-child(1) .result');

        catchEl.textContent = dto.catchCount;
        //missEl.textContent = dto.missCount;

        [winModal, loseModal, gameGrid].forEach(el => {
            if (el) el.style.display = 'none';
        });

        if (dto.status === GameStatuses.SETTINGS) {
            const settings = new Settings({onstart: this.onstart})
            const settingsElement = settings.render(dto)
        } else if (dto.status === GameStatuses.IN_PROGRESS) {
            const grid = new Grid()
            const gridElement = grid.render(dto)
            gameGrid.style.display = 'block'
        } else if (dto.status === GameStatuses.LOSE) {
            const settings = new Settings({restart: this.restart})
            const settingsElement = settings.render(dto)
            loseModal.style.display = 'block'
        } else if (dto.status === GameStatuses.WIN) {
            const settings = new Settings({restart: this.restart})
            const settingsElement = settings.render(dto)
            winModal.style.display = 'block'
        }
    }
}

class Settings {
    #props

    constructor(props) {
        this.#props = props
    }

    render(dto) {
        const container = document.querySelector('.container');
        const button = container.querySelector('.button');

        // Очищаем старый текст и обработчики (если нужно)
        button.textContent = '';
        const newButton = button.cloneNode(true); // Клонируем кнопку, чтобы удалить старые обработчики
        button.replaceWith(newButton);

        if (dto.status === GameStatuses.WIN || dto.status === GameStatuses.LOSE) {
            newButton.style.display = 'inline-block';
            newButton.textContent = 'RESTART';
            newButton.addEventListener('click', () => {
                this.#props?.restart();
                newButton.style.display = 'none';
            });
        } else {
            console.log(dto)
            newButton.textContent = 'START GAME';
            newButton.addEventListener('click', () => {
                this.#props?.onstart();
                newButton.style.display = 'none';
            });
            console.log(dto)
        }

        return container;
    }
}

class Grid {

    render(dto) {
        const table = document.querySelector('.table');
        if (!table) {
            console.error('Таблица не найдена');
            return;
        }
        const rows = table.querySelectorAll('tr');

        for (let y = 0; y < dto.gridSize.rowsCount; y++) {
            const cells = rows[y]?.querySelectorAll('td');
            if (!cells) continue;

            for (let x = 0; x < dto.gridSize.columnsCount; x++) {
                const cell = cells[x];
                if (!cell) continue;

                // Очищаем содержимое ячейки
                cell.innerHTML = '';

                if (dto.player1Position.x === x && dto.player1Position.y === y) {
                    const img = document.createElement('img');
                    img.src = 'img/icons/man01.svg';
                    img.alt = 'man1';
                    cell.appendChild(img);
                } else if (dto.player2Position.x === x && dto.player2Position.y === y) {
                    const img = document.createElement('img');
                    img.src = 'img/icons/man02.svg';
                    img.alt = 'man2';
                    cell.appendChild(img);
                } else if (dto.googlePosition.x === x && dto.googlePosition.y === y) {
                    const img = document.createElement('img');
                    img.src = 'img/icons/googleIcon.svg';
                    img.alt = 'googleIcon';
                    cell.appendChild(img);
                }
            }
        }

        return table;
    }

}