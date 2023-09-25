
let BlockType = {
    DEFAULT: 'default',
    HEAD: 'head',
    TAIL: 'tail',
    FRUIT: 'fruit'
}

let Direction = {
    UP: 'up',
    DOWN: 'down',
    RIGHT: 'right',
    LEFT: 'left'
}

let KeyName = {
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight'
}

let DirectionMap = {
    [KeyName.ArrowUp]: Direction.UP,
    [KeyName.ArrowDown]: Direction.DOWN,
    [KeyName.ArrowLeft]: Direction.LEFT,
    [KeyName.ArrowRight]: Direction.RIGHT,
}

let directionDelta = {
    [Direction.UP]: {x: 0, y: -1},
    [Direction.DOWN]: {x: 0, y: 1},
    [Direction.LEFT]: {x: -1, y: 0},
    [Direction.RIGHT]: {x: 1, y: 0},
}

function getRandomCords(rangeStart = 0, rangeEnd = 25) {
    return {
        x: Math.floor(Math.random() * rangeEnd) + rangeStart,
        y: Math.floor(Math.random() * rangeEnd) + rangeStart,
    }
}

// game state
let game = {
    map: document.querySelector('.game'),
    mapHeight: 25,
    mapWidth: 25,
    speed: 60,
    score: 0,
    scoreElement: document.querySelector('.score'),
    speedElement: document.querySelector('.speed'),
    fruitsCountElement: document.querySelector('.fruits-count'),
    get mapCenterX() {
        return Math.floor(this.mapWidth / 2);
    },
    get mapCenterY() {
        return Math.floor(this.mapHeight / 2);
    },
    isStarted: false,
    fruits: [
        getRandomCords(),
        getRandomCords(),
    ],

    async start() {
        this.isStarted = true;

        while (!this.isLose) {
            snake.move();
            game.logic();
            game.draw();
            await sleep(1000 / this.speed);
        }
    },

    logic() {
        snake.tail.forEach((tail) => {
            if (tail.x === snake.head.x && tail.y === snake.head.y) {
                this.isLose = true;
            }
        });
        for (let i = 0; i < this.fruits.length; i++) {
            let fruitCords = this.fruits[i];
            if (fruitCords.x === snake.head.x && fruitCords.y === snake.head.y) {
                this.score++;
                snake.tail.push({});
                this.fruits.splice(i, 1);
                this.fruits.push(getRandomCords());
                break;
            }
        }
    },

    draw() {
        this.scoreElement.innerText = this.score;
        this.speedElement.innerText = this.speed;
        this.fruitsCountElement.innerText = this.fruits.length;

        let fruitElements = document.querySelectorAll('.fruit');
        fruitElements.forEach((element) => element.classList.remove(BlockType.FRUIT))

        this.fruits.forEach((fruit) => {
            let element = document.querySelector(
                `[data-x="${fruit.x}"][data-y="${fruit.y}"]`
            );
            element.classList.add(BlockType.FRUIT);
        });

        let headElement = document.querySelector('.head');
        headElement.classList.remove(BlockType.HEAD);

        let tailElements = document.querySelectorAll('.tail');
        tailElements.forEach((element) => {
            element.classList.remove(BlockType.TAIL);
        });

        let newHeadElement = document.querySelector(`[data-x="${snake.head.x}"][data-y="${snake.head.y}"]`);
        newHeadElement.classList.add(BlockType.HEAD);

        snake.tail.forEach((tail) => {
            let element = document.querySelector(`[data-x="${tail.x}"][data-y="${tail.y}"]`);
            if (element) {
                element.classList.add(BlockType.TAIL);
            }
        });
    },

    createBlock(x, y, blockType) {
        let block = document.createElement('div');
        block.classList.add('block');
        block.classList.add(blockType);
        block.dataset.x = x;
        block.dataset.y = y;

        return block;
    },

    initGame() {
        let controlButtons = document.querySelectorAll('.control-button');

        controlButtons[0].addEventListener('click', () => {
            this.fruits.push(getRandomCords());
        });
        controlButtons[1].addEventListener('click', () => {
            this.fruits.pop();
        });

        controlButtons[2].addEventListener('click', () => {
            this.speed += 5;
        });
        controlButtons[3].addEventListener('click', () => {
            if (this.speed > 5) {
                this.speed -= 5;
            }
        });

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                let block;

                if (y === this.mapCenterY && x === this.mapCenterX) {
                    block = this.createBlock(x, y, BlockType.HEAD);
                } else if (snake.tail.some((tail) => tail.x === x && tail.y === y)) {
                    block = this.createBlock(x, y, BlockType.TAIL);
                } else if (game.fruits.some((fruit) => fruit.x === x && fruit.y === y)) {
                    block = this.createBlock(x, y, BlockType.FRUIT);
                } else {
                    block = this.createBlock(x, y, BlockType.DEFAULT);
                }

                this.map.appendChild(block);
            }
        }
    }
};

// snake state
let snake = {
    head: {x: game.mapCenterX, y: game.mapCenterY},
    tail: [
        {x: game.mapCenterX, y: game.mapCenterY + 1},
        {x: game.mapCenterX, y: game.mapCenterY + 2},
        {x: game.mapCenterX, y: game.mapCenterY + 3},
        {x: game.mapCenterX, y: game.mapCenterY + 4},
    ],
    direction: Direction.UP,
    move() {
        let delta = directionDelta[this.direction];

        let prev = {...this.head};

        this.head.x += delta.x;
        this.head.y += delta.y;

        if (this.head.x < 0) {
            this.head.x = game.mapWidth - 1;
        }

        if (this.head.x > game.mapWidth - 1) {
            this.head.x = 0;
        }

        if (this.head.y < 0) {
            this.head.y = game.mapHeight - 1;
        }

        if (this.head.y > game.mapHeight - 1) {
            this.head.y = 0;
        }

        this.tail.forEach((tail) => {
            let temp = {...tail};
            tail.y = prev.y;
            tail.x = prev.x;

            prev = temp;
        })
    },
    changeDirection(dir) {
        switch (dir) {
            case Direction.UP: {
                if (this.direction !== Direction.DOWN) {
                    this.direction = dir;
                }
                break;
            }
            case Direction.DOWN: {
                if (this.direction !== Direction.UP) {
                    this.direction = dir;
                }
                break;
            }
            case Direction.LEFT: {
                if (this.direction !== Direction.RIGHT) {
                    this.direction = dir;
                }
                break;
            }
            case Direction.RIGHT: {
                if (this.direction !== Direction.LEFT) {
                    this.direction = dir;
                }
                break;
            }
        }
    }
};

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

game.initGame();

document.addEventListener('keydown', (event) => {
    if (KeyName.hasOwnProperty(event.key)) {
        if (!game.isStarted) {
            game.start()
        } else {
            snake.changeDirection(DirectionMap[event.key]);
        }
    }
});