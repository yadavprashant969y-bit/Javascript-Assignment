const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const startBtn = document.querySelector('#start-btn');
const timeLeftDisplay = document.querySelector('#time-left');

let lastHole;
let timeUp = false;
let score = 0;
let countdown;
let gameTime = 20;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(500, 1000);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    score = 0;
    scoreBoard.textContent = 0;
    timeUp = false;
    let timeLeft = gameTime;
    timeLeftDisplay.textContent = timeLeft;

    startBtn.disabled = true;

    peep();

    countdown = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timeUp = true;
            startBtn.disabled = false;
            alert('Game Over! Your score: ' + score);
        }
    }, 1000);
}

function bonk(e) {
    if (!e.isTrusted) return; // Cheater check
    score++;
    this.parentNode.classList.remove('up');
    scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', bonk));
startBtn.addEventListener('click', startGame);
