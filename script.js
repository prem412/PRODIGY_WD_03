document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let vsAI = false;
    
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];
    
    
    function initGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
        });
    }
    
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        updateGame(clickedCell, clickedCellIndex);
        
        if (vsAI && gameActive && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }
    
    function updateGame(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        checkResult();
    }
    
    function checkResult() {
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                cells[a].classList.add('win');
                cells[b].classList.add('win');
                cells[c].classList.add('win');
                break;
            }
        }
        
        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }
        
        if (!gameState.includes('')) {
            status.textContent = 'Game ended in a draw!';
            gameActive = false;
            return;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }
    
    function makeAIMove() {
        if (!gameActive) return;
        
        let move = findWinningMove('O') || findWinningMove('X') || findRandomMove();
        
        if (move !== null) {
            const cell = document.querySelector(`.cell[index="${move}"]`);
            updateGame(cell, move);
        }
    }
    
    function findWinningMove(player) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            const cells = [gameState[a], gameState[b], gameState[c]];
            
            if (cells.filter(c => c === player).length === 2 && cells.includes('')) {
                return condition[cells.indexOf('')];
            }
        }
        return null;
    }
    
    
    function findRandomMove() {
        const emptyCells = gameState
            .map((cell, index) => cell === '' ? index : null)
            .filter(val => val !== null);
        
        return emptyCells.length > 0 
            ? emptyCells[Math.floor(Math.random() * emptyCells.length)] 
            : null;
    }
    
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', initGame);
    
    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            vsAI = e.target.value === 'ai';
            initGame();
        });
    });
    
    initGame();
});