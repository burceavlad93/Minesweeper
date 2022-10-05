'use strict'
let gameOn = true;                                                                                  // Setting boolean value for game status
let totalBombs = 20;                                                                                // Creating the total value of bombs
let trueTotalOfBombs = 20;                                                                          // Creating control variable for the actual bombs                                                                       
let seconds = 0;                                                                                    // Setting the values of 'seconds' to 0
let minutes = 0;                                                                                    // Setting the value of 'minutes' to 0
let bombs = document.getElementById('totalBombs');                                                  // Creating 'bombs' element
let time = document.getElementById('timer');                                                        // Creating 'time elemnt
const emptyArray = new Array(80).fill(0);                                                           // Creating and filling an array of 80 elements with the number '0'
const bombArray = new Array(20).fill('bomb');                                                       // Creating and filling an array of 20 elements with the string 'bomb'                      
const mixedArray = emptyArray.concat(bombArray);                                                    // Concating the 2 arrays into a new array
const gameContainer = document.getElementById('main');                                              // Creating game board element
const resetBtn = document.getElementById('restart_btn');                                            // Creating reset button element
//------------------------------------------------------------------GENERATINg GAME MAP-------------------------------------------------------------------------------------------------------------------------------------
for (let i = 0; i < 100; ++i) {                                                                     // Generate a 100 divs
    gameContainer.innerHTML += `<div id="${i}" class="box"> </div>`;                                // Each gets an id equal to it's index and a class of box
}
const gameUnits = document.querySelectorAll('.box');                                                // Select all div units
mixedArray.sort(() => Math.random() - 0.5);                                                         // Shuffle the order of the elements within the third array
//------------------------------------------------------------------CHECKING GAME MAP-------------------------------------------------------------------------------------------------------------------------------------
for (let unit = 0; unit < gameUnits.length; ++unit) {                                               // Loop over all 100 divs

    const leftEdge = (unit % 10 == 0);                                                              // Creating a boolean value to see if we are clicking on a div that's on the left edge of the board
    const rightEdge = (unit % 10 == 9);                                                             // Creating a boolean value to see if we are clicking on a div that's on the right edge of the board
    // --> Adding clues for where the bombs are located
    if (mixedArray[unit] == 0) {                                                                     // If the unit is equal to 0 then we check it's neighbours if they are bombs
        if (unit > 0 && !leftEdge && mixedArray[unit - 1] == 'bomb') ++mixedArray[unit];             // If the unit is greater than 0 and it's not on the left side (i % 10 != 0) and the unit from the left of it has a bomb we increment that element from the array
        if (unit > 9 && !rightEdge && mixedArray[unit + 1 - 10] == 'bomb') ++mixedArray[unit];       // If the unit is greater than 9 and it's not on the right side (i % 10 != 9) and the unit form above it to the right has a bomb we increment that element from the array
        if (unit > 10 && mixedArray[unit - 10] == 'bomb') ++mixedArray[unit];                        // If the unit is greater than 10 and the unit above it has a bomb we increment that element from the array
        if (unit > 11 && !leftEdge && mixedArray[unit - 1 - 10] == 'bomb') ++mixedArray[unit];       // If the unit is greater than 11 and it's not on the left side and the unit above it to the left has a bomb we increment that element from the array
        if (unit < 98 && !rightEdge && mixedArray[unit + 1] == 'bomb') ++mixedArray[unit];           // If the unit is smaller than 98 and it's not on the right side and the unit to the right of it has a bomb we increment that element from the array
        if (unit < 90 && !leftEdge && mixedArray[unit - 1 + 10] == 'bomb') ++mixedArray[unit];       // If the unit is smaller than 90 and it's not on the left side and the unit below it to the left has a bomb we increment that element from the array
        if (unit < 88 && !rightEdge && mixedArray[unit + 1 + 10] == 'bomb') ++mixedArray[unit];      // If the unit is smaller than 88 and it's not on the right side and the unit above it to the right has a bomb we increment that element from the array
        if (unit < 89 && mixedArray[unit + 10] == 'bomb') ++mixedArray[unit];                        // If the unit is smaller than 89 and it's the unit above it has a bomb we increment that element from the array
    }
    // --> Left Click Event Listener
    gameUnits[unit].addEventListener('click', function () {
        clickedUnit(unit);
    })
    // --> Right Click Event Listener
    gameUnits[unit].oncontextmenu = function (rightClick) {
        rightClick.preventDefault();                                                                 // Prevent browser menu from opening
        if (gameOn) {
            flagElement(unit);
            checkForFlaggedBombs(unit);
            gameWon();
        }
    }
}
// --> Testing & Explaining purposes
for (let i = 0; i < gameUnits.length; ++i) {
    if (mixedArray[i] == 'bomb') {
        gameUnits[i].style.backgroundColor = 'blue';
    }
}

function clickedUnit(index) {

    if (!gameOn) return;

    if (gameUnits[index].classList.contains('checked') || gameUnits[index].classList.contains('flagged')) {
        return;
    }

    if (mixedArray[index] == 'bomb') {
        gameLost(index);
        showAllBombs();
    } else {
        if (mixedArray[index] != 0) {
            checkedElement(index);
            return;
        }
        checkEmptyUnit(index);
    }
}

function checkEmptyUnit(emptyUnit) {                                                                   // Creating the 'check unit' function
    checkedElement(emptyUnit);
    const leftEdge = (emptyUnit % 10 == 0);                                                       // Creating a boolean value to see if we are clicking on a div that's on the left edge of the board
    const rightEdge = (emptyUnit % 10 == 9);                                                      // Creating a boolean value to see if we are clicking on a div that's on the right edge of the board

    if (emptyUnit > 0 && !leftEdge) clickedUnit(emptyUnit - 1);
    if (emptyUnit > 9 && !rightEdge) clickedUnit(emptyUnit + 1 - 10);
    if (emptyUnit > 10) clickedUnit(emptyUnit - 10);
    if (emptyUnit > 11 && !leftEdge) clickedUnit(emptyUnit - 1 - 10);
    if (emptyUnit < 98 && !rightEdge) clickedUnit(emptyUnit + 1);
    if (emptyUnit < 90 && !leftEdge) clickedUnit(emptyUnit - 1 + 10);
    if (emptyUnit < 88 && !rightEdge) clickedUnit(emptyUnit + 1 + 10);
    if (emptyUnit < 89) clickedUnit(emptyUnit + 10);
}

function checkedElement(elementPosition) {
    if (mixedArray[elementPosition] != 0) {
        gameUnits[elementPosition].innerHTML = mixedArray[elementPosition];
    }
    gameUnits[elementPosition].style.backgroundColor = '#5c5c5c';
    gameUnits[elementPosition].classList.add('checked');
}

function flagElement(flagPosition) {
    // --> Add Flag
    if (!gameUnits[flagPosition].classList.contains('flagged') && !gameUnits[flagPosition].classList.contains('checked') && !gameUnits[flagPosition].classList.contains('bomb')) {
        gameUnits[flagPosition].textContent = '🚩';
        gameUnits[flagPosition].classList.add('flagged');
        return;
    }
    // --> Remove Flag 
    if (gameUnits[flagPosition].classList.contains('flagged') && !gameUnits[flagPosition].classList.contains('checked') && !gameUnits[flagPosition].classList.contains('bomb')) {
        gameUnits[flagPosition].textContent = '';
        gameUnits[flagPosition].classList.remove('flagged');
        return;
    }

}

function showAllBombs() {                                                                   // Creating 'show all bombs' function                                                   
    for (let i = 0; i < 100; ++i) {                                                         // Loop throw all the divs
        if (mixedArray[i] == 'bomb') {                                                      // If the index of that div that coresponds to the index of the element from the array contains a bomb    
            gameLost(i)
        }
    }
}

function gameWon() {
    if (trueTotalOfBombs == 0 && totalBombs == 0) {
        gameOn = false;
        bombs.textContent = 'YOU WON! 🏆'
        clearInterval(chronometer);
        for (let i = 0; i < gameUnits.length; ++i) {
            if (mixedArray[i] != 'bomb') checkedElement(i);
        }
    }
}

function gameLost(bombLocation) {
    gameOn = false;
    bombs.textContent = 'You Lost! 💥'
    gameUnits[bombLocation].textContent = '💣';
    gameUnits[bombLocation].style.backgroundColor = 'yellow';
    gameUnits[bombLocation].classList.add('bomb');
    clearInterval(chronometer);
}

function checkForFlaggedBombs(flagLocation) {                                                           // Creating 'check for flagged bombs'

    if (gameUnits[flagLocation].classList.contains('flagged')) {
        bombs.textContent = `Bombs: ${--totalBombs}`;

        if (mixedArray[flagLocation] == 'bomb') --trueTotalOfBombs;
    }

    if (!gameUnits[flagLocation].classList.contains('flagged') && !gameUnits[flagLocation].classList.contains('checked') && !gameUnits[flagLocation].classList.contains('bomb')) {
        bombs.textContent = `Bombs: ${++totalBombs}`;

        if (mixedArray[flagLocation] == 'bomb') ++trueTotalOfBombs;
    }
}

const chronometer = setInterval(function () {                                               // Creating in game timer
    ++seconds;                                                                              // Every 1000 millisecond we increment the 'seconds' variable

    if (seconds < 10) {                                                                     // If the 'seconds' variable is lesser than 10
        time.textContent = `Time ${minutes}:0${seconds}`;                                   // Update the single digit unit from the in game timer 
    }

    if (seconds >= 10 && seconds < 60) {                                                    // If the 'seconds' variable is greater or equal to 10 and is smaller than 60
        time.textContent = `Time ${minutes}:${seconds}`;                                    // Update the double digit unit from the in game timer
    }

    if (seconds == 60) {                                                                    // If the 'seconds' variable is equal to 60
        ++minutes;                                                                          // Increment the 'minutes' variable
        seconds = 0;                                                                        // Set 'seconds' variable back to 0
        time.textContent = `Time ${minutes}:00`;                                            // Update the minute mark from the in game timmer
    }
}, 1000)                                                                                    // The timer is updated every second                       

resetBtn.addEventListener('click', function () {
    location.reload();
})
