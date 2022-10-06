'use strict'
let clickedBomb = false;
let gameOn = true;
let totalBombs = 20;
let trueTotalOfBombs = 20;
let seconds = 0;
let minutes = 0;
let bombs = document.getElementById('totalBombs');
let time = document.getElementById('timer');
const emptyArray = new Array(80).fill(0);
const bombArray = new Array(20).fill('bomb');
const mixedArray = emptyArray.concat(bombArray);
const gameContainer = document.getElementById('main');
const resetBtn = document.getElementById('restart_btn');
//------------------------------------------------------------------GENERATINg GAME MAP-------------------------------------------------------------------------------------------------------------------------------------
for (let i = 0; i < 100; ++i) {
    gameContainer.innerHTML += `<div id="${i}" class="box"> </div>`;
}
const gameUnits = document.querySelectorAll('.box');
mixedArray.sort(() => Math.random() - 0.5);                                                                     // Suffle Array
//------------------------------------------------------------------GAME MECHANICS------------------------------------------------------------------------------------------------------------------------------------------
for (let unit = 0; unit < gameUnits.length; ++unit) {
    const leftEdge = (unit % 10 == 0);
    const rightEdge = (unit % 10 == 9);
    if (mixedArray[unit] == 0) {                                                                                // If current element is 0, check 
        if (unit > 0 && !leftEdge && mixedArray[unit - 1] == 'bomb') ++mixedArray[unit];
        if (unit > 9 && !rightEdge && mixedArray[unit + 1 - 10] == 'bomb') ++mixedArray[unit];
        if (unit > 10 && mixedArray[unit - 10] == 'bomb') ++mixedArray[unit];
        if (unit > 11 && !leftEdge && mixedArray[unit - 1 - 10] == 'bomb') ++mixedArray[unit];
        if (unit < 98 && !rightEdge && mixedArray[unit + 1] == 'bomb') ++mixedArray[unit];
        if (unit < 90 && !leftEdge && mixedArray[unit - 1 + 10] == 'bomb') ++mixedArray[unit];
        if (unit < 88 && !rightEdge && mixedArray[unit + 1 + 10] == 'bomb') ++mixedArray[unit];
        if (unit < 89 && mixedArray[unit + 10] == 'bomb') ++mixedArray[unit];
    }
    gameUnits[unit].addEventListener('click', function () {
        clickedUnit(unit);                                                                                      // Call 'clickedUnit()' function
    })
    gameUnits[unit].oncontextmenu = function (rightClick) {
        rightClick.preventDefault();                                                                            // Prevent rightclick browser menu
        if (gameOn) {
            flagElement(unit);                                                                                  // Call 'flagElement()' function 
            checkForFlaggedBombs(unit);
            if (trueTotalOfBombs == 0 && totalBombs == 0) gameResult();                                         // If both bomb counters are 0, call 'gameResult() function
        }
    }
}
// ClickedUnit() Function --> verifies the status of the game and the element's type and class
function clickedUnit(index) {
    if (!gameOn) return;
    if (gameUnits[index].classList.contains('checked') || gameUnits[index].classList.contains('flagged')) return;
    if (mixedArray[index] == 'bomb') {
        bombs.textContent = 'You Lost! 💥'
        clickedBomb = true;
        gameResult();                                                                                           // Call 'gameResult()' function if current element is bomb
    } else {
        if (mixedArray[index] != 0) {
            checkedElement(index);                                                                              // Call 'checkedElement()' function if current element is NOT a bomb and it's not 0
            return;
        }
        checkEmptyUnit(index);                                                                                  // Call 'checkEmptyUnit()' function if current element is NOT a bomb and it's equal to 0
    }
}
// CheckeEmptyUnit() Function --> checks all of it's surrounding neighbours
function checkEmptyUnit(emptyUnit) {
    checkedElement(emptyUnit);                                                                                  // Call 'checkedElement()' function
    const leftEdge = (emptyUnit % 10 == 0);
    const rightEdge = (emptyUnit % 10 == 9);
    if (emptyUnit > 0 && !leftEdge) clickedUnit(emptyUnit - 1);
    if (emptyUnit > 9 && !rightEdge) clickedUnit(emptyUnit + 1 - 10);
    if (emptyUnit > 10) clickedUnit(emptyUnit - 10);
    if (emptyUnit > 11 && !leftEdge) clickedUnit(emptyUnit - 1 - 10);
    if (emptyUnit < 98 && !rightEdge) clickedUnit(emptyUnit + 1);
    if (emptyUnit < 90 && !leftEdge) clickedUnit(emptyUnit - 1 + 10);
    if (emptyUnit < 88 && !rightEdge) clickedUnit(emptyUnit + 1 + 10);
    if (emptyUnit < 89) clickedUnit(emptyUnit + 10);
}
// CheckedElement() Function --> reveals current element by displaying it's number if it's not 0, changing it's color and adding a new class
function checkedElement(elementPosition) {
    if (mixedArray[elementPosition] != 0) {
        gameUnits[elementPosition].innerHTML = mixedArray[elementPosition];
    }
    gameUnits[elementPosition].style.backgroundColor = '#5c5c5c';
    gameUnits[elementPosition].classList.add('checked');
}
// FlagElement() Function --> adds of removes flag icon and class from the current element
function flagElement(flagPosition) {
    // --> Add Flag
    if (!gameUnits[flagPosition].classList.contains('flagged') && !gameUnits[flagPosition].classList.contains('checked') && !gameUnits[flagPosition].classList.contains('bomb')) {
        gameUnits[flagPosition].textContent = '🚩';
        gameUnits[flagPosition].classList.add('flagged');
        return;
    } else {
        gameUnits[flagPosition].textContent = '';
        gameUnits[flagPosition].classList.remove('flagged');
        return;
    }
}
// GameResult() Function --> If a bomb was clicked it will reveal all bombs, but if all bomb were flagged it will reveal all remaining non bomb element
function gameResult() {
    gameOn = false;
    clearInterval(chronometer);                                                                                 // Call 'clearInterval()' function
    for (let i = 0; i < gameUnits.length; ++i) {
        if (clickedBomb && mixedArray[i] == 'bomb') {
            gameUnits[i].textContent = '💣';
            gameUnits[i].style.backgroundColor = 'yellow';
            gameUnits[i].classList.add('bomb');
        }
        if (!clickedBomb && mixedArray[i] != 'bomb') {
            bombs.textContent = 'YOU WON! 🏆'
            checkedElement(i);                                                                                  // Call 'checkedElement()' function
        }
    }
}
// CheckForFlaggedBombs() Function --> updates bomb counter score and keeps track of both bomb counters
function checkForFlaggedBombs(flagLocation) {
    if (gameUnits[flagLocation].classList.contains('flagged')) {
        bombs.textContent = `Bombs: ${--totalBombs}`;
        if (mixedArray[flagLocation] == 'bomb') --trueTotalOfBombs;
    } else {
        bombs.textContent = `Bombs: ${++totalBombs}`;
        if (mixedArray[flagLocation] == 'bomb') ++trueTotalOfBombs;
    }
}
// Timer Function
const chronometer = setInterval(function () {
    ++seconds;
    if (seconds < 10) time.textContent = `Time ${minutes}:0${seconds}`;
    if (seconds >= 10 && seconds < 60) time.textContent = `Time ${minutes}:${seconds}`;
    if (seconds == 60) {
        ++minutes;
        seconds = 0;
        time.textContent = `Time ${minutes}:00`;
    }
}, 1000)
// Reload Function
resetBtn.addEventListener('click', () => location.reload());                                    
