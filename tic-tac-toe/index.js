
let fields = document.querySelectorAll('.game__field');
let scoreElements = document.querySelectorAll('.game__score span');
console.log(scoreElements);
let game = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
]
let currentPlayer = 'cross';

function clearFields(fields, game) {
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        field.classList.remove('cross', 'zero');

        let row = Math.floor(i / 3);
        let column = i % 3;
        game[row][column] = '';
    }
}

function checkWin(isEmpty, isEqual) {
    if (!isEmpty && isEqual) {
        let playerIndex = currentPlayer === 'cross' ? 0 : 1;
        let playerScore = parseInt(scoreElements[playerIndex].innerText);
        scoreElements[playerIndex].innerText = playerScore + 1;
        clearFields(fields, game);
    }
}

function checkDraw(fields, game) {
    let filledCount = 0;
    for (let i = 0; i < game.length; i++) {
        let currentRow = game[i];
        let isFull = currentRow[0] !== '' && currentRow[1] !== '' && currentRow[2] !== '';
        if (isFull) {
            filledCount++;
        }
    }
    if (filledCount === 3) {
        clearFields(fields, game);
    }
}

for (let i = 0; i < fields.length; i++) {
    let field = fields[i];

    field.addEventListener('click', function () {
        if (field.classList.contains('cross') || field.classList.contains('zero')) {
            return;
        }
        let row = Math.floor(i / 3);
        let column = i % 3;
        game[row][column] = currentPlayer;
        field.classList.add(currentPlayer);

        for (let j = 0; j < game.length; j++) {
            let currentRow = game[j];
            let isEmpty = currentRow[0] === '' || currentRow[1] === '' || currentRow[2] === '';
            let isEqual = currentRow[0] === currentRow[1] && currentRow[1] === currentRow[2];
            checkWin(isEmpty, isEqual);
        }

        for (let j = 0; j < game.length; j++) {
            let isEmpty = game[0][j] === '' || game[1][j] === '' || game[2][j] === '';
            let isEqual = game[0][j] === game[1][j] && game[1][j] === game[2][j];
            checkWin(isEmpty, isEqual);
        }

        let isFirstDiagonalEmpty = game[0][0] === '' || game[1][1] === '' || game[2][2] === '';
        let isFirstDiagonalEqual = game[0][0] === game[1][1] && game[1][1] === game[2][2];
        checkWin(isFirstDiagonalEmpty, isFirstDiagonalEqual);

        let isSecondDiagonalEmpty = game[0][2] === '' || game[1][1] === '' || game[2][0] === '';
        let isSecondDiagonalEqual = game[0][2] === game[1][1] && game[1][1] === game[2][0];
        checkWin(isSecondDiagonalEmpty, isSecondDiagonalEqual);

        checkDraw(fields, game);

        if (currentPlayer === 'cross') {
            currentPlayer = 'zero';
        } else {
            currentPlayer = 'cross';
        }
    });

}