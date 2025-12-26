const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const BLOCK_SIZE = 20;  //放大畫素，20點為一格
const MAP_SIZE = canvas.width/BLOCK_SIZE ; // (寬400 / 格20) = 20格子(列)
let score = 0;      // 紀錄分數

//加上屬性    
snake = {
    //身體位置    
    body: [ { x: MAP_SIZE / 2, y: MAP_SIZE / 2 } ],  
    //身體長度    
    size: 5, 
    //行進方向 
    direction: { x: 0, y: -1 },
    //畫蛇
    drawSnake: function () {
        this.moveSnake();
        ctx.fillStyle = '#8ccf65ff';  // 淺綠（蘋果綠）
        for (let i = 0; i < this.body.length; i++) {      
           ctx.fillRect(
                this.body[i].x * BLOCK_SIZE,
                this.body[i].y * BLOCK_SIZE,
                BLOCK_SIZE - 1,  // 留縫隙更美觀
                BLOCK_SIZE - 1
            );
        }
    },
    //移動蛇
    moveSnake: function () {
    newBlock = {
        x: this.body[0].x + this.direction.x,
        y: this.body[0].y + this.direction.y
    }
    this.body.unshift(newBlock);
    while (this.body.length > this.size) {
        this.body.pop();
    }
    },
}
apple = {
    //蘋果位置
    x: 5,
    y: 5,
    //畫蘋果
    drawApple: function () {
    ctx.fillStyle = '#ff4444';  // 紅色蘋果
    ctx.fillRect(
        this.x * BLOCK_SIZE,
        this.y * BLOCK_SIZE,
        BLOCK_SIZE - 1,
        BLOCK_SIZE - 1
    );

    },
    //放蘋果
    putApple: function () {
        this.x = Math.floor(Math.random() * MAP_SIZE);
        this.y = Math.floor(Math.random() * MAP_SIZE);
    },

}

function keyDown(event) {
    //up
    if (event.keyCode == 38 || event.keyCode == 87){
        if (snake.direction.y == 1) return;
            snake.direction.y = -1;
            snake.direction.x = 0;
    }
    //down
    else if (event.keyCode == 83 || event.keyCode == 40) {
        if (snake.direction.y == -1) return;
            snake.direction.y = 1;
            snake.direction.x = 0;
    }
    //left
    else if (event.keyCode == 37 || event.keyCode == 65) {
        if (snake.direction.x == 1) return;
            snake.direction.y = 0;
            snake.direction.x = -1;
    }
    //right
    else if (event.keyCode == 68 || event.keyCode == 39) {
        if (snake.direction.x == -1) return;
            snake.direction.y = 0;
            snake.direction.x = 1;
    }
}

function drawGame() {
    drawMap();
    apple.drawApple();
    snake.drawSnake();
    eatApple(); 
    drawScore();
    checkDeath();    
}

function drawMap() {
    ctx.fillStyle = '#fffff0';  // 米白底
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function eatApple() {
    if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
        snake.size += 1;
        score++;
        apple.putApple();
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Score " + score, canvas.width - 50, 10);    
}

function checkDeath() {
    // hit walls
    if( (snake.body[0].x < 0) ||
        (snake.body[0].x >= MAP_SIZE)||
        (snake.body[0].y < 0) ||
        (snake.body[0].y >= MAP_SIZE)
    ){
        clearInterval(gameInterval);
    }
    // hit body
    for (var i=1; i<snake.body.length; i++) {
        if (snake.body[0].x === snake.body[i].x &&
            snake.body[0].y === snake.body[i].y) {
                clearInterval(gameInterval);
            }  
    }
}

/////
document.addEventListener("keydown", keyDown);

function gameStart() {
    gameInterval = setInterval(drawGame, 100);
}
/////
const startButton = document.getElementById("startBtn"); // <-- 把 "startBtn" 換成你的按鈕 id

function initGame() {
    // 重置分數
    score = 0;
    // 重置蛇
    snake.body = [{ x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) }];
    snake.size = 5;
    snake.direction = { x: 0, y: -1 };
    // 放置蘋果（避免與蛇重疊可再加檢查）
    apple.putApple();
    // 清畫面並先畫一次初始畫面
    drawMap();
    apple.drawApple();
    snake.drawSnake();
    drawScore();
}

if (startButton) {
    startButton.addEventListener("click", function () {
        // 若已有遊戲定時器，先停止（避免重複）
        if (typeof gameInterval !== "undefined") {
            clearInterval(gameInterval);
        }
        initGame();   // 初始化遊戲狀態
        gameStart();  // 再開始遊戲迴圈
    });
}