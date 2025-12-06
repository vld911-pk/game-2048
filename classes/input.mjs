export default class Input {

    static UP = 'up';
    static DOWN = 'down';
    static LEFT = 'left';
    static RIGHT = 'right';

    constructor(ctx = window, callback) {
        window.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'ArrowRight':
                    callback(Input.RIGHT);
                    break;
                case 'ArrowLeft':
                    callback(Input.LEFT);
                    break
                case 'ArrowUp':
                    callback(Input.UP);
                    break
                case 'ArrowDown':
                    callback(Input.DOWN);
                    break
            }
        })
    }
}