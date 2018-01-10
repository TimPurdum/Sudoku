var pencilMode = false;
var row = 0;
var column = 0;
function togglePencilMark(box, index) {
    if (box.innerHTML === index.toString()) {
        box.innerHTML = '_';
    }
    else {
        box.innerHTML = index.toString();
    }
}
function togglePencilMode(button) {
    const pencilTables = document.querySelectorAll('table');
    let table;
    if (pencilMode) {
        //turn off pencil
        button.style.backgroundColor = 'gray';
        for (table of pencilTables) {
            if (table.classList.contains('pencil')) {
                table.style.zIndex = '1';
            }
        }
    }
    else {
        button.style.backgroundColor = 'red';
        for (table of pencilTables) {
            var guess = table.parentElement.lastElementChild;
            if (table.classList.contains('pencil') && !guess.value) {
                table.style.zIndex = '3';
            }
        }
    }
    pencilMode = !pencilMode;
}
function saveGuess(row, column, guess) {
    if (!guess.value) {
        eraseGuess(guess);
    }
    else {
        guess.style.backgroundColor = 'white';
        guess.style.color = 'black';
    }
}
function eraseGuess(guess) {
    const pencilTable = guess.parentElement.firstElementChild;
    if (pencilMode) {
        pencilTable.style.zIndex = '3';
    }
    guess.style.backgroundColor = 'transparent';
    guess.style.color = 'transparent';
}
function setSquare(r, c) {
    row = r;
    column = c;
    const square = document.getElementById(`square-${row}-${column}`);
    square.style.borderWidth = '3px';
    if (!square.value) {
        square.style.color = 'transparent';
    }
}
document.addEventListener('keydown', (e) => {
    if (e.keyCode > 36 && e.keyCode < 41) {
        const oldSquare = document.getElementById(`square-${row}-${column}`);
        oldSquare.style.borderWidth = '1px';
        switch (e.keyCode) {
            case 40:
                if (row < 8) {
                    row++;
                }
                break;
            case 38:
                if (row > 0) {
                    row--;
                }
                break;
            case 37:
                if (column > 0) {
                    column--;
                }
                break;
            case 39:
                if (column < 8) {
                    column++;
                }
                break;
        }
        const newSquare = document.getElementById(`square-${row}-${column}`);
        newSquare.style.borderWidth = '3px';
        newSquare.focus();
        e.preventDefault();
    }
    else if (e.keyCode > 48 && e.keyCode < 58) {
        if (pencilMode) {
            e.preventDefault();
            const index = e.keyCode - 48;
            const pencil = document.getElementById(`p-${row}-${column}-${index}`);
            togglePencilMark(pencil, index);
        }
    }
    else if (e.keyCode === 32) {
        togglePencilMode(document.getElementById('pencil-toggle-button'));
        e.preventDefault();
    }
    else if (e.keyCode === 8) {
        document.getElementById(`square-${row}-${column}`).value = '';
    }
});
