const menu = document.getElementById('menu');
const game = document.getElementById('game');
const endScreen = document.getElementById('endScreen');
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const onePlayerBtn = document.getElementById('onePlayer');
const twoPlayersBtn = document.getElementById('twoPlayers');
const playAgainBtn = document.getElementById('playAgain');
const mainMenuBtn = document.getElementById('mainMenu');
const winnerText = document.getElementById('winnerText');

const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 10;
const maxScore = 5;

let gameMode = '1P';
let leftPaddle, rightPaddle, ball;
let leftScore = 0, rightScore = 0;
let keys = {};
let ballSpeedIncrement = 0.1;
let baseBallSpeed = 3;
let currentBallSpeed;

function resetGame() {
    leftPaddle = { x: 0, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
    rightPaddle = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
    ball = { x: canvas.width / 2, y: canvas.height / 2, dx: baseBallSpeed * (Math.random() > 0.5 ? 1 : -1), dy: baseBallSpeed * (Math.random() > 0.5 ? 1 : -1) };
    currentBallSpeed = baseBallSpeed;
    leftScore = 0;
    rightScore = 0;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = baseBallSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = baseBallSpeed * (Math.random() > 0.5 ? 1 : -1);
    currentBallSpeed = baseBallSpeed;
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawText(text, x, y) {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(text, x, y);
}

function drawCenterLine() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
        ball.dy *= -1;
    }

    if (ball.x <= leftPaddle.x + paddleWidth &&
        ball.y + ballSize >= leftPaddle.y &&
        ball.y <= leftPaddle.y + paddleHeight) {
        ball.dx *= -1;
        ball.dx += ball.dx > 0 ? ballSpeedIncrement : -ballSpeedIncrement;
        ball.dy += ball.dy > 0 ? ballSpeedIncrement : -ballSpeedIncrement;
        currentBallSpeed += ballSpeedIncrement;
    }

    if (ball.x + ballSize >= rightPaddle.x &&
        ball.y + ballSize >= rightPaddle.y &&
        ball.y <= rightPaddle.y + paddleHeight) {
        ball.dx *= -1;
        ball.dx += ball.dx > 0 ? ballSpeedIncrement : -ballSpeedIncrement;
        ball.dy += ball.dy > 0 ? ballSpeedIncrement : -ballSpeedIncrement;
        currentBallSpeed += ballSpeedIncrement;
    }

    if (ball.x <= 0) {
        rightScore++;
        resetBall();
    }

    if (ball.x + ballSize >= canvas.width) {
        leftScore++;
        resetBall();
    }
}

function movePaddles() {
    if (gameMode === '1P') {
        const predictionError = Math.random() > 0.85; // 15% chance to fail
        if (!predictionError) {
            rightPaddle.y += (ball.y - (rightPaddle.y + paddleHeight / 2)) * 0.15;
        }
    }

    if (keys['ArrowUp'] && rightPaddle.y > 0) {
        rightPaddle.y -= 5;
    }
    if (keys['ArrowDown'] && rightPaddle.y < canvas.height - paddleHeight) {
        rightPaddle.y += 5;
    }
    if (keys['w'] && leftPaddle.y > 0) {
        leftPaddle.y -= 5;
    }
    if (keys['s'] && leftPaddle.y < canvas.height - paddleHeight) {
        leftPaddle.y += 5;
    }
}

function checkWin() {
    if (leftScore >= maxScore) {
        winnerText.textContent = 'Player 1 Wins!';
        endGame();
    } else if (rightScore >= maxScore) {
        winnerText.textContent = gameMode === '1P' ? 'AI Wins!' : 'Player 2 Wins!';
        endGame();
    }
}

function endGame() {
    game.classList.remove('active');
    endScreen.classList.add('active');
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRect(0, 0, canvas.width, canvas.height, '#222');
    drawRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight, 'white');
    drawRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight, 'white');
    drawRect(ball.x, ball.y, ballSize, ballSize, 'white');

    drawText(leftScore, canvas.width / 4, 20);
    drawText(rightScore, (3 * canvas.width) / 4, 20);

    drawCenterLine();  
}

function gameLoop() {
    moveBall();
    movePaddles();
    draw();
    checkWin();
    requestAnimationFrame(gameLoop);
}

onePlayerBtn.addEventListener('click', () => {
    gameMode = '1P';
    menu.classList.remove('active');
    game.classList.add('active');
    resetGame();
    gameLoop();
});

twoPlayersBtn.addEventListener('click', () => {
    gameMode = '2P';
    menu.classList.remove('active');
    game.classList.add('active');
    resetGame();
    gameLoop();
});

playAgainBtn.addEventListener('click', () => {
    endScreen.classList.remove('active');
    game.classList.add('active');
    resetGame();
    gameLoop();
});

mainMenuBtn.addEventListener('click', () => {
    endScreen.classList.remove('active');
    menu.classList.add('active');
});

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});