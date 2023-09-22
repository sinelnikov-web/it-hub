let BlockType = {
    DEFAULT: 'default',
    HEAD: 'head',
    TAIL: 'tail',
    FRUIT: 'fruit',
}

let KeyName = {
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight'
}

let Direction = {
    UP: 'up',
    LEFT: 'left',
    RIGHT: 'right',
    DOWN: 'down'
}

let DirectionKeyMap = {
    [KeyName.ArrowDown]: Direction.DOWN,
    [KeyName.ArrowLeft]: Direction.LEFT,
    [KeyName.ArrowUp]: Direction.UP,
    [KeyName.ArrowRight]: Direction.RIGHT,
}

let DirectionDelta = {
    [Direction.DOWN]: {x: 0, y: 1},
    [Direction.UP]: {x: 0, y: -1},
    [Direction.LEFT]: {x: -1, y: 0},
    [Direction.RIGHT]: {x: 1, y: 0},
}

let map = document.querySelector('.game');
let mapHeight = 25;
let mapWidth = 25;
let mapCenterY = Math.floor(mapHeight / 2);
let mapCenterX = Math.floor(mapWidth / 2);

let snake = {
    head: {y: mapCenterY, x: mapCenterX},
    tail: [
        {y: mapCenterY + 1, x: mapCenterX},
        {y: mapCenterY + 2, x: mapCenterX},
        {y: mapCenterY + 3, x: mapCenterX},
        {y: mapCenterY + 4, x: mapCenterX},
    ],
    direction: Direction.UP,

    move() {
        let {x: deltaX, y: deltaY} = DirectionDelta[this.direction];

        let prev = {...this.head};

        this.head.y += deltaY;
        this.head.x += deltaX;

        if (this.head.x < 0) {
            this.head.x = mapWidth - 1;
        }
        if (this.head.x > mapWidth - 1) {
            this.head.x = 0;
        }

        if (this.head.y < 0) {
            this.head.y = mapHeight - 1;
        }
        if (this.head.y > mapHeight - 1) {
            this.head.y = 0;
        }

        this.tail.forEach((tailPart) => {
            let temp = {...tailPart};
            tailPart.x = prev.x;
            tailPart.y = prev.y;
            prev = temp;
        })
    },

    changeDirection(dir) {
        switch (dir) {
            case Direction.UP: {
                if (this.direction !== Direction.DOWN) {
                    this.direction = Direction.UP;
                }
                break;
            }
            case Direction.DOWN: {
                if (this.direction !== Direction.UP) {
                    this.direction = Direction.DOWN;
                }
                break
            }
            case Direction.LEFT: {
                if (this.direction !== Direction.RIGHT) {
                    this.direction = Direction.LEFT;
                }
                break
            }
            case Direction.RIGHT: {
                if (this.direction !== Direction.LEFT) {
                    this.direction = Direction.RIGHT;
                }
                break
            }
        }
    }
}

let game = {
    isStarted: false,
    async startGame() {
        this.isStarted = true;

        while (true) {
            snake.move();
            game.draw();
            await sleep(1000 / 20);
        }
    },
    draw() {
        let headElement = document.querySelector('.head');
        headElement.classList.remove('head');

        let newHeadElement = document.querySelector(`[data-x="${snake.head.x}"][data-y="${snake.head.y}"]`);
        newHeadElement.classList.add('head');

        let tailElements = document.querySelectorAll('.tail');
        tailElements.forEach(element => element.classList.remove('tail'));

        snake.tail.forEach((tailPart) => {
            console.log({tailPart});
            let tailElement = document.querySelector(`[data-x="${tailPart.x}"][data-y="${tailPart.y}"]`);
            console.log({tailElement});
            tailElement.classList.add('tail');
        })
    },
    createGameBlock(y, x, blockType = BlockType.DEFAULT) {
        let block = document.createElement('div');
        block.classList.add('game__block', blockType);
        block.dataset.x = x;
        block.dataset.y = y;
        return block;
    },
    initializeGame() {
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                let block;

                if (y === mapCenterY && x === mapCenterX) {
                    block = this.createGameBlock(y, x, BlockType.HEAD);
                } else if (snake.tail.some(({x: tailX, y: tailY}) => tailY === y && tailX === x)) {
                    block = this.createGameBlock(y, x, BlockType.TAIL);
                } else {
                    block = this.createGameBlock(y, x);
                }

                map.appendChild(block);
            }
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', game.initializeGame.bind(game));
document.addEventListener('keydown', (event) => {
    if (KeyName.hasOwnProperty(event.key)) {
        if (!game.isStarted) {
            game.startGame();
        } else {
            snake.changeDirection(DirectionKeyMap[event.key]);
        }
    }
})