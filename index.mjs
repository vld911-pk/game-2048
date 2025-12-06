import Base from './classes/base.mjs';
import Input from './classes/input.mjs';
import Draw from './classes/draw.mjs';
import Config from './classes/config.mjs';

const gameStatus = {
    pending: 'pending',
    end: 'end',
}

class Main {
    constructor({ input, base, config, draw, canvas }) {
        this.input = input;
        this.config = new config();
        this.canvas = canvas;
        this.base = new base({ size: this.config.size });
        this.draw = new draw(this.config, this.canvas);
        this.status = gameStatus.pending;
    }

    endAlert() {
        alert('end game');
    }

    start() {
        this.initListeners();
        this.base.init();
        this.base.createTiles({ count: 2 });
        this.draw.init();
        this.draw.draw(this.base.matrix_array);

        new this.input(window, (direction) => {
            if (this.status !== gameStatus.pending) {
                this.endAlert();
            }

            this.update(direction);
        })
    }

    update(dir) {
        this.base.move(dir);
        this.base.createTiles({ count: 1 });
        this.draw.draw(this.base.matrix_array);

        if (!this.base.emptyTiles()?.length) {
            this.status = gameStatus.end;
        }
    }

    reset() {
        this.status = gameStatus.pending;
        this.base.init();
        this.base.createTiles({ count: 2 });
        this.draw.draw(this.base.matrix_array);
    }

    initListeners() {
        const abort = new AbortController();
        const resetBtn = this.canvas.document.querySelector('#reset');

        resetBtn.addEventListener('click', () => {
            this.reset();
        }, { signal: abort.signal });
    }
}

(new Main({
    base: Base,
    input: Input,
    config: Config,
    draw: Draw,
    canvas: window,
})).start();

// ToDO
// 1) fix config
// 2) fix end game
// 3) refactor Draw class

// [[2,0,0,0], [4,0,0,0], [0,0,0,0], [0,0,0,0]]
// [[4,8,4,8], [8,4,8,4], [4,8,4,8], [8,4,0,0]]