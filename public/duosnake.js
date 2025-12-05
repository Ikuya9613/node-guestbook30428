const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const buttonStart = document.getElementById("buttonStart");

const BLOCK_SIZE = 20;
const MAP_SIZE = canvas.width / BLOCK_SIZE;

let snake1, snake2, apple;
let gameInterval, appleInterval;

class Snake {
    constructor(x, y, color, keys) {
        this.reset(x, y);
        this.color = color;
        this.keys = keys; // [up, down, left, right]
    }

    reset(x, y) {
        this.body = [{ x, y }];
        this.size = 5;
        this.score = 0;
        this.dir = { x: 0, y: -1 };
    }

    draw() {
        ctx.fillStyle = this.color;
        this.body.forEach(seg => {
            ctx.fillRect(seg.x * BLOCK_SIZE, seg.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        });
    }

    move() {
        const head = {
            x: this.body[0].x + this.dir.x,
            y: this.body[0].y + this.dir.y
        };

        // 撞牆或自己 → 遊戲結束
        if (head.x < 0 || head.x >= MAP_SIZE || head.y < 0 || head.y >= MAP_SIZE ||
            this.body.some(seg => seg.x === head.x && seg.y === head.y)) {
            gameOver();
            return;
        }

        this.body.unshift(head);
        if (this.body.length > this.size) this.body.pop();
    }

    eat() {
        for (let i = apple.apples.length - 1; i >= 0; i--) {
            if (this.body[0].x === apple.apples[i].x && this.body[0].y === apple.apples[i].y) {
                apple.apples.splice(i, 1);
                this.size++;
                this.score++;
            }
        }
    }

    changeDir(keyCode) {
        if (keyCode === this.keys[0] && this.dir.y !== 1)  this.dir = { x: 0, y: -1 }; // 上
        if (keyCode === this.keys[1] && this.dir.y !== -1) this.dir = { x: 0, y: 1 };  // 下
        if (keyCode === this.keys[2] && this.dir.x !== 1)  this.dir = { x: -1, y: 0 }; // 左
        if (keyCode === this.keys[3] && this.dir.x !== -1) this.dir = { x: 1, y: 0 };  // 右
    }
}

class Apple {
    constructor() { this.apples = []; this.spawn(); }

    draw() {
        ctx.fillStyle = '#ff0044';
        this.apples.forEach(a => {
            ctx.fillRect(a.x * BLOCK_SIZE + 2, a.y * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
        });
    }

    spawn() {
        let x, y;
        do {
            x = Math.floor(Math.random() * MAP_SIZE);
            y = Math.floor(Math.random() * MAP_SIZE);
        } while (
            snake1?.body.some(s => s.x === x && s.y === y) ||
            snake2?.body.some(s => s.x === x && s.y === y)
        );
        this.apples.push({ x, y });
    }
}

function init() {
    snake1 = new Snake(8, 8, '#00ff00', [87, 83, 65, 68]);        // WASD
    snake2 = new Snake(MAP_SIZE - 9, MAP_SIZE - 9, '#0088ff', [38, 40, 37, 39]); // 箭頭鍵
    apple = new Apple();
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    apple.draw();
    snake1.draw();
    snake2.draw();

    ctx.fillStyle = '#0ff';
    ctx.font = '20px Arial';
    ctx.fillText(`P1: ${snake1.score}`, 15, 30);
    ctx.fillText(`P2: ${snake2.score}`, canvas.width - 100, 30);
}

function update() {
    snake1.move(); snake1.eat();
    snake2.move(); snake2.eat();
    draw();
}

function gameStart() {
    gameOver();
    gameInterval = setInterval(update, 110);
    appleInterval = setInterval(() => apple.spawn(), 4000);
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(appleInterval);
}

window.addEventListener('keydown', e => {
    snake1.changeDir(e.keyCode);
    snake2.changeDir(e.keyCode);
});

buttonStart.onclick = () => {
    init();
    gameStart();
};

// 初始畫面
init();
draw();