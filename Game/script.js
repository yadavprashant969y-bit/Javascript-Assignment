document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const winnerOverlay = document.getElementById('winner-overlay');
    const winnerMessage = document.getElementById('winner-message');
    const scoreXElement = document.querySelector('#score-x .value');
    const scoreOElement = document.querySelector('#score-o .value');
    const playerXCard = document.getElementById('score-x');
    const playerOCard = document.getElementById('score-o');

    let currentPlayer = 'X';
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let scores = { X: 0, O: 0 };

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerText = currentPlayer;
        clickedCell.classList.add(currentPlayer === 'X' ? 'x-cell' : 'o-cell');

        // Add a small bounce animation
        clickedCell.style.transform = 'scale(0.8)';
        setTimeout(() => {
            clickedCell.style.transform = 'scale(1)';
        }, 100);
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerHTML = `Player <span class="current-player-icon ${currentPlayer}">${currentPlayer}</span>'s Turn`;

        // Update active card styling
        if (currentPlayer === 'X') {
            playerXCard.classList.add('active-x');
            playerOCard.classList.remove('active-o');
        } else {
            playerOCard.classList.add('active-o');
            playerXCard.classList.remove('active-x');
        }
    }

    function handleResultValidation() {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winningLine = winCondition;
                break;
            }
        }

        if (roundWon) {
            gameActive = false;
            highlightWinner(winningLine);
            scores[currentPlayer]++;
            updateScores();
            showWinnerOverlay(`Player ${currentPlayer} Wins!`);
            return;
        }

        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            gameActive = false;
            showWinnerOverlay("It's a Draw!");
            return;
        }

        handlePlayerChange();
    }

    function highlightWinner(line) {
        line.forEach(index => {
            cells[index].classList.add('winner');
        });
    }

    function updateScores() {
        scoreXElement.innerText = scores.X;
        scoreOElement.innerText = scores.O;
    }

    function showWinnerOverlay(message) {
        winnerMessage.innerText = message;
        winnerOverlay.classList.remove('hidden');
    }

    function handleRestartGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusText.innerHTML = `Player <span class="current-player-icon X">X</span>'s Turn`;
        winnerOverlay.classList.add('hidden');

        playerXCard.classList.add('active-x');
        playerOCard.classList.remove('active-o');

        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove('x-cell', 'o-cell', 'winner');
            cell.style.transform = 'scale(1)';
        });
    }

    // Initialize
    playerXCard.classList.add('active-x');
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', handleRestartGame);
    newGameBtn.addEventListener('click', handleRestartGame);
});
