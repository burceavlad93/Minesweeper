'use strict'
let clickedBomb = false;
let gameOn = true;
let totalBombs = 20;
let trueTotalOfBombs = 20;
let seconds = 0;
let minutes = 0;
let bombs = document.getElementById('totalBombs');
let time = document.getElementById('timer');
let unit;
const gameGrid = new Array(12);
const mineMap = new Array(12);
const emptyArray = new Array(80).fill(0);
const bombArray = new Array(20).fill('bomb');
const mixedArray = emptyArray.concat(bombArray);
const gameContainer = document.getElementById('map');
const resetBtn = document.getElementById('restart_btn');
mixedArray.sort(() => Math.random() - 0.5);                                                                     // Suffle Array
//------------------------------------------------------------------SETTING UP GAME-------------------------------------------------------------------------------------------------------------------------------------
gameBoard();                                                                                                    // Calling gameBoard() function
createMap();                                                                                                    // Calling createMap() function
setClues();                                                                                                     // Calling setClues() function
//------------------------------------------------------------------GAME FUNCTIONS-------------------------------------------------------------------------------------------------------------------------------------
// GameBoard() function --> generates the end user game board
function gameBoard() {                                                                                          // The ON SCREEN board will be a 10 x 10 grid but the real board will be a 12 x 12 grid 
    let element = -1;
    for (let row = 0; row < gameGrid.length; ++row) {
        gameGrid[row] = new Array(12);
        for (let col = 0; col < gameGrid[row].length; ++col) {
            if (row == 0 || row == 11 || col == 0 || col == 11) {                                               // The first and last row together with the first and last column will function as a 'ghost frame'
                gameGrid[row][col] = 'X';                                                                       // The 'ghost frame' will appear as and 'X' in the grid array
            } else {                                                                                            // If the element is within the 'ghost frame'
                unit = document.createElement('div');                                                           // Create a new 'div' element
                unit.setAttribute('class', 'box');                                                              // Assign the class '.box' to that element
                unit.setAttribute('id', `${++element}`)                                                         // Assing the id coresponding to the element variable
                unit.dataset.row = `${row}`;                                                                    // Assing data informartion 'row'
                unit.dataset.column = `${col}`;                                                                 // Assing data information 'column'
                gameContainer.append(unit);                                                                     // Append the created element to the div container
                gameGrid[row][col] = document.getElementById(`${element}`);                                     // Grab each element created with getElementById
                gameGrid[row][col].addEventListener('click', function () {                                      // AddEventListener to each element created 
                    clickedUnit(row, col);                                                                      // Calling clieckedUnit() function
                })

                gameGrid[row][col].oncontextmenu = function (rightClick) {                                      // Add right click function
                    rightClick.preventDefault();                                                                // Prevent rightclick browser menu
                    if (gameOn) {
                        flagElement(row, col);                                                                  // Calling flagElement() function 
                        checkForFlaggedBombs(row, col);                                                         // Calling checkForFlaggedBombs() function
                        if (trueTotalOfBombs == 0 && totalBombs == 0) gameResult();                             // If both bomb counters are 0, call 'gameResult() function
                    }
                }
            }
        }
    }
}
// CreateMap() function --> generates a copy of the end user game board but with all the locations of the mines
function createMap() {                                                                                          // Similar to gameBoard() function
    let element = -1;
    for (let row = 0; row < mineMap.length; ++row) {
        mineMap[row] = new Array(12);
        for (let col = 0; col < mineMap[row].length; ++col) {
            if (row == 0 || row == 11 || col == 0 || col == 11) {
                mineMap[row][col] = 'X';
            } else {                                                                                            // Each element of the mineMap grid gets and element from the mixedArray
                mineMap[row][col] = mixedArray[++element];
            }
        }
    }
}
// SetClues() function --> takes the created mineMap grid and sets up clues on the neighboring elements of each bomb
function setClues() {
    for (let row = 0; row < mineMap.length; ++row) {
        for (let col = 0; col < mineMap[row].length; ++col) {
            if (mineMap[row][col] == 'bomb') {                                                                  // When a bomb is found
                for (let x = row - 1; x <= row + 1; ++x) {                                                      // Check all it's 8 neighbors
                    for (let y = col - 1; y <= col + 1; ++y) {
                        if (!isNaN(mineMap[x][y])) ++mineMap[x][y];                                             // If the neighbor is a number then increment that element
                    }
                }
            }
        }
    }
}
// ClickedUnit() Function --> verifies the status of the game and the element's type and class
function clickedUnit(row, column) {
    if (!gameOn) return;
    if (gameGrid[row][column].classList.contains('checked') || gameGrid[row][column].classList.contains('flagged')) return;
    if (mineMap[row][column] == 'bomb') {
        bombs.textContent = 'You Lost! 💥'
        clickedBomb = true;
        gameResult();                                                                                           // Calling gameResult() function if current element is bomb
    } else {
        if (mineMap[row][column] != 0) {
            checkedElement(row, column);                                                                        // Calling checkedElement() function if current element is NOT a bomb and it's not 0
            return;
        }
        checkEmptyUnit(row, column);                                                                            // Calling checkEmptyUnit() function if current element is NOT a bomb and it's equal to 0
    }
}
// CheckedElement() Function --> reveals current element by displaying it's number if it's not 0, changing it's color and adding a new class
function checkedElement(row, column) {
    if (mineMap[row][column] != 0) {
        gameGrid[row][column].innerHTML = mineMap[row][column];
    }
    gameGrid[row][column].style.backgroundColor = '#5c5c5c';
    gameGrid[row][column].classList.add('checked');
}
// CheckeEmptyUnit() Function --> checks all of it's surrounding neighbours
function checkEmptyUnit(row, column) {
    checkedElement(row, column);                                                                                // Calling checkedElement() function
    for (let x = row - 1; x <= row + 1; ++x) {
        for (let y = column - 1; y <= column + 1; ++y) {
            if (!isNaN(mineMap[x][y])) {                                                                        // If the neighbor is a number                                                      
                clickedUnit(x, y);                                                                              // Pass the current element to clickedUnit() function
            }
        }
    }
}
// FlagElement() Function --> adds of removes flag icon and class from the current element
function flagElement(row, column) {
    // --> Add Flag
    if (!gameGrid[row][column].classList.contains('flagged') && !gameGrid[row][column].classList.contains('checked') && !gameGrid[row][column].classList.contains('bomb')) {
        gameGrid[row][column].textContent = '🚩';
        gameGrid[row][column].classList.add('flagged');
        return;
    } else {
        gameGrid[row][column].textContent = '';
        gameGrid[row][column].classList.remove('flagged');
        return;
    }
}
// CheckForFlaggedBombs() Function --> updates bomb counter score and keeps track of both bomb counters
function checkForFlaggedBombs(row, column) {
    if (gameGrid[row][column].classList.contains('flagged')) {
        bombs.textContent = `Bombs: ${--totalBombs} `;
        if (mineMap[row][column] == 'bomb') --trueTotalOfBombs;
    } else {
        bombs.textContent = `Bombs: ${++totalBombs} `;
        if (mineMap[row][column] == 'bomb') ++trueTotalOfBombs;
    }
}
// GameResukt() Function --> updates end user has won or lost the game
function gameResult() {
    gameOn = false;
    clearInterval(chronometer);                                                                                   // Call 'clearInterval()' function
    for (let x = 1; x < mineMap.length - 1; ++x) {
        for (let y = 1; y < mineMap[x].length - 1; ++y) {
            if (clickedBomb && mineMap[x][y] == 'bomb') {
                gameGrid[x][y].textContent = '💣';
                gameGrid[x][y].style.backgroundColor = 'yellow';
                gameGrid[x][y].classList.add('bomb');
            }
            if (!clickedBomb && mineMap[x][y] != 'bomb') {
                bombs.textContent = 'YOU WON! 🏆'
                checkedElement(x, y);                                                                             // Call 'checkedElement()' function
            }
        }
    }
}
// Timer Function
const chronometer = setInterval(function () {
    ++seconds;
    if (seconds < 10) time.textContent = `Time ${minutes}:0${seconds} `;
    if (seconds >= 10 && seconds < 60) time.textContent = `Time ${minutes}:${seconds} `;
    if (seconds == 60) {
        ++minutes;
        seconds = 0;
        time.textContent = `Time ${minutes}:00`;
    }
}, 1000)
// Reload Function
resetBtn.addEventListener('click', () => location.reload());
