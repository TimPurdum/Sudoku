﻿var pencilMode = false;

function togglePencilMark(box: HTMLButtonElement, index: number) {
    if (box.innerHTML === index.toString()) {
        box.innerHTML = '_';
    } else {
        box.innerHTML = index.toString();
    }
}

function togglePencilMode(button: HTMLButtonElement) {
    const pencilTables = document.querySelectorAll('table');

    let table: HTMLTableElement;
    if (pencilMode) {
        //turn off pencil
        button.classList.remove('btn-danger');
        button.classList.add('btn-primary');
        for (table of pencilTables) {
            if (table.classList.contains('pencil')) {
                table.style.zIndex = '1';
            }
        }
    } else {
        button.classList.remove('btn-primary');
        button.classList.add('btn-danger');
        for (table of pencilTables) {
            var guess = table.parentElement.lastElementChild as HTMLInputElement;
            if (table.classList.contains('pencil') && !guess.value) {
                table.style.zIndex = '3';
            }
        }
    }
    pencilMode = !pencilMode;
}

function saveGuess(row: number, column: number, guess: HTMLInputElement) {
    if (!guess.value) {
        eraseGuess(guess);
    } else {
        guess.style.backgroundColor = 'white';
    }
}

function eraseGuess(guess: HTMLInputElement) {
    const pencilTable = guess.parentElement.firstElementChild as HTMLTableElement;
    if (pencilMode) {
        pencilTable.style.zIndex = '3';
    }
}