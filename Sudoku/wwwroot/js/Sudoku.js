var pencilMode = false;
var row = 0;
var column = 0;
function togglePencilMark(box, index) {
    if (box.innerHTML === index.toString()) {
        box.innerHTML = '';
    }
    else {
        box.innerHTML = index.toString();
    }
    savePencil(box);
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
            if (table.classList.contains('pencil') && guess.innerText === '') {
                table.style.zIndex = '3';
            }
        }
    }
    pencilMode = !pencilMode;
}
function saveGuess(row, column, guess) {
    var value = 0;
    if (guess.innerText === '') {
        eraseGuess(guess);
    }
    else {
        guess.style.backgroundColor = 'white';
        guess.style.color = 'black';
        guess.style.zIndex = '5';
        value = Number.parseInt(guess.value);
    }
    $.post('saveguess', {
        "row": row,
        "column": column,
        "guess": value
    });
}
function eraseGuess(guess) {
    const pencilTable = guess.parentElement.firstElementChild;
    if (pencilMode) {
        pencilTable.style.zIndex = '3';
    }
    guess.style.backgroundColor = 'transparent';
    guess.style.zIndex = '1';
}
function setSquare(r, c) {
    row = r;
    column = c;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 0; j++) {
            const square = document.getElementById(`square-${i}-${j}`);
            const pencilTable = square.parentElement.firstElementChild;
            if (i === r && j === c) {
                square.style.borderWidth = '3px';
                pencilTable.style.borderWidth = '3px';
            }
            else {
                square.style.borderWidth = '1px';
                pencilTable.style.borderWidth = '1px';
            }
        }
    }
}
document.addEventListener('keydown', (e) => {
    if (e.keyCode > 36 && e.keyCode < 41) {
        //Cursor
        const oldSquare = document.getElementById(`square-${row}-${column}`);
        oldSquare.style.borderWidth = '1px';
        const oldPencil = oldSquare.parentElement.firstElementChild;
        oldPencil.style.borderWidth = '1px';
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
        const newPencil = newSquare.parentElement.firstElementChild;
        newPencil.style.borderWidth = '3px';
        newSquare.focus();
        e.preventDefault();
    }
    else if (e.keyCode > 48 && e.keyCode < 58) {
        //Numbers
        e.preventDefault();
        const index = e.keyCode - 48;
        if (pencilMode) {
            const pencil = document.getElementById(`p-${row}-${column}-${index}`);
            togglePencilMark(pencil, index);
        }
        else {
            const guess = document.getElementById(`square-${row}-${column}`);
            if (!guess.classList.contains('clue')) {
                guess.innerHTML = index.toString();
                saveGuess(row, column, guess);
            }
        }
    }
    else if (e.keyCode === 32) {
        //Space
        togglePencilMode(document.getElementById('pencil-toggle-button'));
        e.preventDefault();
    }
    else if (e.keyCode === 8) {
        //Backspace
        const guess = document.getElementById(`square-${row}-${column}`);
        if (!guess.classList.contains('clue')) {
            guess.innerHTML = '';
            eraseGuess(guess);
        }
    }
});
function checkAnswers() {
    const guesses = document.getElementsByClassName('guess');
    for (let i = 0; i < guesses.length; i++) {
        const g = guesses[i];
        if (g.classList.contains('clue')) {
            continue;
        }
        const id = g.id;
        const coords = id.split('-');
        const gRow = coords[1];
        const gCol = coords[2];
        const gVal = g.innerText;
        const answer = document.getElementById(`answer-${gRow}-${gCol}`).value;
        if (isNaN(parseInt(gVal))) {
            continue;
        }
        if (parseInt(gVal) === parseInt(answer)) {
            g.style.backgroundColor = 'lightgreen';
        }
        else {
            g.style.backgroundColor = 'rgb(255, 150, 150)';
        }
    }
}
function savePencil(box) {
    var id = box.id;
    var elements = id.split('-');
    var r = Number.parseInt(elements[1]);
    var c = Number.parseInt(elements[2]);
    var i = Number.parseInt(elements[3]);
    var marked = box.value == i.toString();
    $.post('savepencil', {
        "row": r,
        "column": c,
        "index": i,
        "marked": marked
    });
}
