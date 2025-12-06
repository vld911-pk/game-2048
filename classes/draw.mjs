
export default class Draw {
    constructor(config, canvas = window) {
        this.canvas = canvas;
        this.config = config;
        this.drawMethod = config.drawMode === 'simple'
            ? this.#simple.bind(this)
            : this.#ui.bind(this);

        this.canvas.document.querySelector(config.drawMode === 'simple' ? '#simpleUI' : '#UI').style.display = 'block';
        this.canvas.document.querySelector(config.drawMode !== 'simple' ? '#simpleUI' : '#UI').style.display = 'none';
    }


    #simple(matrix) {
        const res = JSON.stringify(matrix)
            .replaceAll('[', '')
            .replaceAll(']', '')
            .split(',')
            .reduce((acc, item) => {
                const lastArray = acc.at(-1);
                if (lastArray?.length < 4) {
                    lastArray.push(item);
                } else if (acc?.at(-1) === 4) {
                    lastArray?.push([item])
                } else {
                    acc?.push([item])
                }

                return acc;
            },[]).join('\n');

        this.canvas.document.querySelector('#simpleUI').textContent = res;
    }

    #ui(matrix) {
        for(let i = 0; i < this.config.size; i++) {
            for(let j = 0; j < this.config.size; j++) {
                const cell = this.canvas.document.querySelector(`[data-pos="${i}-${j}"`);
                const value = matrix[i][j];

                if (!value) {
                    cleanUpCell(cell)
                    continue;
                }

                cleanUpCell(cell)
                cell.classList.add(`num-${value}`);
                cell.textContent = value;
            }
        }

        function cleanUpCell(el) {
            el.classList = ['cell'];
            el.textContent = '';
        }
    }

    init() {
        const cellTemplate = this.canvas.document.querySelector('#cell-item');
        const grid = this.canvas.document.querySelector('.grid');
        const fragment = this.canvas.document.createDocumentFragment();

        for(let i = 0; i < this.config.size; i++) {
            for(let j = 0; j < this.config.size; j++) {
                const cell = cellTemplate.content.firstElementChild.cloneNode();
                cell.dataset.pos = `${i}-${j}`;
                fragment.appendChild(cell);
            }
        }

        grid.appendChild(fragment);
    }

    draw(matrix) {
        if (!matrix) {
            return;
        }

        this.drawMethod(matrix);
    }
}