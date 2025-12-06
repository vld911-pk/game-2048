import Input from './input.mjs';

export default class Base {

    get matrix_array() {
        return this.matrix;
    }

    constructor({ size }) {
        this.size = size;
        this.matrix = null;
    }

    init() {
        this.matrix = this.#createMatrix({ size: this.size });
    }


    #createMatrix({ size }) {
        return Array.from({ length: size },
            () => Array.from({ length: size },
                () => 0));
    }

    createTiles({ count = 1 }) {
        const empty = this.emptyTiles(this.matrix);
        if (!empty?.length) return;

        for(let i = 0; i < count; i++) {
            const [posX, posY] = empty[Math.floor(Math.random() * empty.length)];
            this.matrix[posX][posY] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    emptyTiles() {
        if (!this.matrix) return [];

        const empty = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.matrix[i][j] === 0) {
                    empty.push([i, j]);
                }
            }
        }

        return empty;
    }

    #operateRow(row) {
        if (!row) {
            throw new Error('no row to operate');
        }

        const rowLength = row.length;
        for(let i = 0; i < rowLength; i++) {

            if (row[i] === row[i + 1]) {
                row[i + 1] = row[i]*2;
                row[i] = 0;
                // without increment could be second addition
                // which is out of rules
                ++i;
                continue;
            }

            if (row[i] && row[i + 1] === 0) {
                row[i + 1] = row[i];
                row[i] = 0;
                continue;
            }

        }
        return row;
    }

    #compressRow(row) {
        return [
            ...row.filter(v => v === 0),
            ...row.filter(Boolean)];
    }

    #getRow(rI, dir) {

        if ([Input.UP, Input.DOWN].includes(dir)) {
            const res = [];

            for (let i = 0; i < this.size; i++) {
                res.push(this.matrix[i][rI]);
            }

            return res;
        }

        return this.matrix[rI];
    }

    #updateRow(rI, row, dir) {
        if ([Input.UP, Input.DOWN].includes(dir)) {
            for (let i = 0; i < this.size; i++) {
                this.matrix[i][rI] = row[i];
            }
        }

        else this.matrix[rI] = row;
    }

    move(dir) {
        // debugger;
        for (let i = 0; i < this.size; i++) {
            const row = [...this.#getRow(i, dir)];

            if ([Input.LEFT, Input.UP].includes(dir)) {
                row.reverse();
            }

            const compressedRow = this.#compressRow(this.#operateRow(row));

            if ([Input.LEFT, Input.UP].includes(dir)) {
                compressedRow.reverse();
            }

            this.#updateRow(i, compressedRow, dir);
        }
    }
}