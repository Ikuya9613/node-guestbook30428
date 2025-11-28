// draw.js - 完美搭配上面美化版 HTML 的加強版繪圖腳本
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 讓 canvas 在高 DPI 螢幕也清晰（Retina 支援）
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    // 重新設定一次畫布樣式避免變形
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 初始設定
let drawing = false;
let lastX = 0;
let lastY = 0;

ctx.lineCap = 'round';      // 筆觸圓潤
ctx.lineJoin = 'round';     // 轉折圓滑

// 綁定控制元件
const colorInput = document.getElementById('color');
const lineWidthInput = document.getElementById('lineWidth');
const valueOutput = document.getElementById('value');
const clearBtn = document.getElementById('clear');
const toshowBtn = document.getElementById('toshow');
const imgShow = document.getElementById('show');

// 即時更新粗細顯示
lineWidthInput.addEventListener('input', (e) => {
    valueOutput.textContent = e.target.value;
    ctx.lineWidth = e.target.value;
});
valueOutput.textContent = lineWidthInput.value;
ctx.lineWidth = lineWidthInput.value;

// 即時更新顏色
colorInput.addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value; // 之後如果要做填滿也會跟著變
});
ctx.strokeStyle = colorInput.value;

// === 繪圖核心函式 ===
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function startDrawing(e) {
    drawing = true;
    const pos = getMousePos(e);
    lastX = pos.x;
    lastY = pos.y;

    // 點一下就畫一個點（避免拖曳時第一筆沒畫到）
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(lastX + 0.1, lastY + 0.1);
    ctx.stroke();
}

function draw(e) {
    if (!drawing) return;

    const pos = getMousePos(e);
    const currentX = pos.x;
    const currentY = pos.y;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    if (drawing) {
        drawing = false;
    }
}

// === 滑鼠事件 ===
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing); // 滑鼠離開也結束繪圖

// === 觸控支援（手機平板也能畫！）===
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

// === 清除畫布 ===
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    imgShow.style.display = 'none'; // 隱藏上次產生的圖片
});

// === 產生圖片並顯示 ===
toshowBtn.addEventListener('click', () => {
    // 使用 toDataURL 產生圖片（預設 png）
    const dataURL = canvas.toDataURL('image/png');
    imgShow.src = dataURL;
    imgShow.style.display = 'block';
    imgShow.scrollIntoView({ behavior: 'smooth' }); // 自動滾動到圖片區
});

// === 可選：按右鍵用白色當橡皮擦（超實用小彩蛋）===
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const oldColor = ctx.strokeStyle;
    const oldWidth = ctx.lineWidth;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = oldColor;
    ctx.lineWidth = oldWidth;
});

// === 開頭範例圖形（可自行刪除）===
// 你原本畫的那些圖形，保留當作「開場動畫」或直接刪掉也行
function drawDemo() {
    // 你原本的範例程式碼（已稍微優化）
    ctx.fillStyle = '#333';
    ctx.fillRect(600, 100, 500, 500);
    ctx.clearRect(700, 150, 100, 100);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 8;
    ctx.strokeRect(725, 175, 50, 50);
    
    // 其他圖形...（省略，你可以保留或刪除）
}

// 如果你想要一開啟就顯示你原本畫的範例，取消下面這行註解：
// drawDemo();