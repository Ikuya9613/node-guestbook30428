const guessSubmit = document.querySelector(".guessSubmit");
const guessField = document.querySelector(".guessField");
const guesses = document.querySelector(".guesses");
const result = document.querySelector(".result");
const count = document.querySelector(".count");
const reset = document.querySelector(".reset");

let countNum =0;   //廣域變數
let randomNumber = Math.floor(Math.random() * 100) + 1;
console.log("觀察隨機的數字：", randomNumber);

function checkGuess() {
    countNum++;
    guessField.focus();       //游標焦點預設在輸入欄位裡
    count.textContent = "猜測次數："+countNum;
    if (countNum >=10 ) {
        setGameOver();
        result.textContent = "遊戲結束! 正確數字是 "+ randomNumber;
        result.textContent = "猜數字這麼菜，還是去多看《我的奮鬥》吧，即將在 3 秒後跳轉......";
        setTimeout(() => {
            window.open("https://upload.wikimedia.org/wikipedia/commons/2/2e/NLC416-07jh010010-20862_%E6%88%91%E4%B9%8B%E5%A5%AE%E9%AC%A5.pdf", "_blank");
        }, 3000);
        return;
    }
    
    const userGuess = Number(guessField.value);  //取得欄位值，並轉為數字
    guesses.textContent += userGuess + " ";  //顯示歷史猜測紀錄
    if  (userGuess === randomNumber ) {
    result.textContent = "猜測結果：Congratulations!" ;
    setGameOver();
    }
    else if (userGuess  < randomNumber ) {
    result.textContent = "猜測結果：數字太小!" ;
    }
    else if (userGuess  >  randomNumber ) {
    result.textContent = "猜測結果：數字太大!";
    }
}

function setGameOver() {
        guessField.disabled = true; //停止輸入功能
        guessSubmit.disabled = true;    //停止按鈕功能
}

function resetGame() {
        countNum = 0;
        count.textContent = "猜測次數："+countNum;
       guessField.disabled = false; //啟用輸入功能
       guessSubmit.disabled = false;    //啟用按鈕功能
}

guessSubmit.addEventListener("click", checkGuess);   //當按鈕被點擊，執行函式
reset.addEventListener("click", resetGame);   //當按鈕被點擊，執行函式

guessField.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault(); // 如果 input 在 form 中，阻止表單提交
        checkGuess();
    }
});