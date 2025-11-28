const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const buttonStart = document.getElementById("buttonStart");
const BLOCK_SIZE = 20;  //放大畫素，20點為一格
const MAP_SIZE = canvas.width / BLOCK_SIZE ; // (寬400 / 格20) = 20格子(列)
let score1 = 0;     // 紀錄分數
let score2 = 0;     // 紀錄分數
const playerKey1 = [38,40,37,39];     //按鍵配製1 上下左右
const playerKey2 = [87,83,65,68];     //按鍵配製2 wsad

let snake1;
let snake2;
let apple;
let gameInterval;
let appleInterval;

function drawGame() {
    // 填滿黑底
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (apple) apple.drawApple();
    if (snake1) snake1.drawSnake();
    if (snake2) snake2.drawSnake();

    ctx.fillStyle = 'white'; // 文字改成白色以便在黑底上可見
    ctx.font = '16px Arial';
    ctx.fillText('P1: ' + (snake1 ? snake1.score : 0), 10, 20);
    ctx.fillText('P2: ' + (snake2 ? snake2.score : 0), canvas.width - 70, 20);
}

function gameStart() {
    gameOver();
    gameInterval = setInterval(drawGame, 100);
    appleInterval = setInterval(function() {
        apple.putApple();
    }, 3000); // 每3秒放置一個新的蘋果
}

//建構蛇蛇類別
class Snake { 
    //蛇蛇建構子(建構屬性)
    //蛇蛇功能(drawSnake)
    //蛇蛇功能(moveSnake)
    //蛇蛇功能(eatApple)
    //蛇蛇功能(checkDeath)
    //蛇蛇功能(move)
    
    //蛇蛇建構子(建構屬性)
    constructor(startX, startY, snakeColor, playerKey) {
        this.body = [{ x: startX, y: startY }];
        this.size = 5;
        this.score = 0;
        this.color = snakeColor;
        this.direction = { x: 0, y: -1 };
        this.playerKey = playerKey;
    }

    //蛇蛇功能(drawSnake)
    drawSnake() {
        this.moveSnake();
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillRect(
                this.body[i].x * BLOCK_SIZE,
                this.body[i].y * BLOCK_SIZE,
                BLOCK_SIZE,
                BLOCK_SIZE
            );
        }
        this.eatApple();
    }

    //蛇蛇功能(moveSnake)
    moveSnake() {
        let newBlock = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        };
        this.body.unshift(newBlock);
        while (this.body.length > this.size) {
            this.body.pop();
        }
        this.checkDeath();
    }

    //蛇蛇功能(eatApple)
    eatApple() {
        if (!apple) return;
        for (let i = 0; i < apple.apples.length; i++) {
            if (
                this.body[0].x === apple.apples[i].x &&
                this.body[0].y === apple.apples[i].y
            ) {
                apple.apples.splice(i, 1);
                this.size++;
                this.score++;
            }
        }
    }

    //蛇蛇功能(checkDeath)
    checkDeath() {
        if (
            this.body[0].x < 0 ||
            this.body[0].x >= MAP_SIZE ||
            this.body[0].y < 0 ||
            this.body[0].y >= MAP_SIZE
        ) {
            this.score = this.score - 10;
            gameOver();
        }
        for (let i = 1; i < this.body.length; i++) {
            if (
                this.body[0].x === this.body[i].x &&
                this.body[0].y === this.body[i].y
            ) {
                this.score = this.score - 10;
                gameOver();
            }
        }
    }

    //蛇蛇功能(move)
    move(e) {
        // use the event passed in (avoid deprecated global 'event')
        //up
        if (e.keyCode == this.playerKey[0] && this.direction.y !== 1 ) {
            this.direction = { x: 0, y: -1 };
        }
        //down
        else if (e.keyCode == this.playerKey[1] && this.direction.y !== -1) {
            this.direction = { x: 0, y: 1 };
        }
        //left
        else if (e.keyCode == this.playerKey[2] && this.direction.x !== 1) {
            this.direction = { x: -1, y: 0 };    
        }
        //right
        else if (e.keyCode == this.playerKey[3] && this.direction.x !== -1) {
            this.direction = { x: 1, y: 0 };    
        }
    }
}

class Apple {
    //蘋果建構子(建構屬性)
    //蘋果功能(drawApple)
    //蘋果功能(putApple)

    //蘋果建構子(建構屬性)
    constructor() {
        this.apples = [];
        this.putApple();
    }

    drawApple() {
        ctx.fillStyle = 'red';
        for (let i = 0; i < this.apples.length; i++) {
            ctx.fillRect(
                this.apples[i].x * BLOCK_SIZE,
                this.apples[i].y * BLOCK_SIZE,
                BLOCK_SIZE,
                BLOCK_SIZE
            );
        }
    }

    putApple() {
        let x = Math.floor(Math.random() * MAP_SIZE);
        let y = Math.floor(Math.random() * MAP_SIZE);
        this.apples.push({ x: x, y: y });
    }
}

function resetGameEntities() {
    snake1 = new Snake(5, 5, 'green', playerKey1);
    snake2 = new Snake(MAP_SIZE - 6, MAP_SIZE - 6, 'blue', playerKey2);
    apple = new Apple();
    score1 = 0;
    score2 = 0;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (apple) apple.drawApple();
    if (snake1) snake1.drawSnake();
    if (snake2) snake2.drawSnake();

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('P1: ' + (snake1 ? snake1.score : 0), 10, 20);
    ctx.fillText('P2: ' + (snake2 ? snake2.score : 0), canvas.width - 70, 20);
}

function gameOver() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    if (appleInterval) {
        clearInterval(appleInterval);
        appleInterval = null;
    }
    // leave snakes/apples in place so player can see final state; press Start to reset
}

// route keyboard to both snakes
window.addEventListener('keydown', function (e) {
    if (snake1) snake1.move(e);
    if (snake2) snake2.move(e);
});

// Start button resets entities then starts the game
buttonStart.addEventListener('click', function () {
    resetGameEntities();
    drawGame();
    gameStart();
});

// initialize entities so the canvas isn't empty
resetGameEntities();
drawGame();