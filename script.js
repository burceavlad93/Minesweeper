'use strict'
let gameOn = true;                                                                          // Setting boolean value for game status
let totalBombs = 20;                                                                        // Setting the total value of bombs
let seconds = 0;                                                                            // Setting the values of 'seconds' to 0
let minutes = 0;                                                                            // Setting the value of 'minutes' to 0
let bombs = document.getElementById('totalBombs');                                          // Creating 'bombs' element
let time = document.getElementById('timer');                                                // Creating 'time elemnt
const emptyArray = new Array(80).fill(0);                                                   // Creating and filling an array of 80 elements with the number '0'
const bombArray = new Array(20).fill('bomb');                                               // Creating and filling an array of 20 elements with the string 'bomb'                      
const mixedArray = emptyArray.concat(bombArray);                                            // Concating the 2 arrays into a new array
const gameContainer = document.getElementById('main');                                      // Creating game board element
const resetBtn = document.getElementById('restart_btn');                                    // Creating reset button element

//------------------------------------------------------------------GENERATINg GAME MAP-------------------------------------------------------------------------------------------------------------------------------------

for (let i = 0; i < 100; ++i) {                                                             // Generate a 100 divs
    gameContainer.innerHTML += `<div id="${i}" class="box"> </div>`;                        // Each gets an id equal to it's index and a class of box
}

const gameUnits = document.querySelectorAll('.box');                                        // Select all div units
mixedArray.sort(() => Math.random() - 0.5);                                                 // Shuffle the order of the elements within the third array

//------------------------------------------------------------------CHECKING GAME MAP-------------------------------------------------------------------------------------------------------------------------------------
for (let i = 0; i < gameUnits.length; ++i) {                                                // Loop over all 100 divs

    gameUnits[i].addEventListener('click', function () {                                    // Added event listener for all the divs with the default click of the left mouse button
        click(i);                                                                           // Within that event listener, we call a function with a parameter within the function
    })

    gameUnits[i].oncontextmenu = function (e) {                                              // Similar to the event listener we add the 'oncontextmenu' so we can use the right mouse button

        e.preventDefault();

        if (!gameUnits[i].classList.contains('flagged')) {                                  // If the the div we are checking does NOT contain the class of 'flagged'
            gameUnits[i].textContent = '🚩';                                                // We add the flag icon to the game board
            gameUnits[i].classList.add('flagged');                                          // We add a new class to that div name 'flagged'
            --totalBombs;                                                                   // We decrement the total number of bomb shown on screen regardless if the flag is placed correctly or not
            bombs.textContent = `Bombs: ${totalBombs}`;                                     // Update the game on screen bomb count

        } else {                                                                            // If the div we right click contain the class of 'flagged'
            gameUnits[i].textContent = '';                                                  // We remove the flag icon from that unit
            gameUnits[i].classList.remove('flagged');                                       // We also remove the 'flagged' class name
            ++totalBombs;                                                                   // Increment the total number of bombs
            bombs.textContent = `Bombs: ${totalBombs}`;                                     // Update the game on screen bomb count
        }
        checkForFlaggedBombs();                                                             // Calling the 'check for flagged bombs'  functions
    }

    const leftEdge = (i % 10 == 0);                                                         // Creating a boolean value to see if we are clicking on a div that's on the left edge of the board
    const rightEdge = (i % 10 == 9);                                                        // Creating a boolean value to see if we are clicking on a div that's on the right edge of the board

    if (mixedArray[i] == 0) {                                                               // If the element from the shuffled array with the index of the div we just clicked is equal to 0

        if (i > 0 && !leftEdge && mixedArray[i - 1] == 'bomb') mixedArray[i]++;             // If the index is greater than 0 and it's not on the left side (i % 10 != 0) and the unit from the left of it has a bomb we increment that element from the array
        if (i > 9 && !rightEdge && mixedArray[i + 1 - 10] == 'bomb') mixedArray[i]++;       // If the index is greater than 9 and it's not on the right side (i % 10 != 9) and the unit form above it to the right has a bomb we increment that element from the array
        if (i > 10 && mixedArray[i - 10] == 'bomb') mixedArray[i]++;                        // If the index is greater than 10 and the unit above it has a bomb we increment that element from the array
        if (i > 11 && !leftEdge && mixedArray[i - 1 - 10] == 'bomb') mixedArray[i]++;       // If the index is greater than 11 and it's not on the left side and the unit above it to the left has a bomb we increment that element from the array
        if (i < 98 && !rightEdge && mixedArray[i + 1] == 'bomb') mixedArray[i]++;           // If the index is smaller than 98 and it's not on the right side and the unit to the right of it has a bomb we increment that element from the array
        if (i < 90 && !leftEdge && mixedArray[i - 1 + 10] == 'bomb') mixedArray[i]++;       // If the index is smaller than 90 and it's not on the left side and the unit below it to the left has a bomb we increment that element from the array
        if (i < 88 && !rightEdge && mixedArray[i + 1 + 10] == 'bomb') mixedArray[i]++;      // If the index is smaller than 88 and it's not on the right side and the unit above it to the right has a bomb we increment that element from the array
        if (i < 89 && mixedArray[i + 10] == 'bomb') mixedArray[i]++;                        // If the index is smaller than 89 and it's the unit above it has a bomb we increment that element from the array
    }
}

function click(index) {                                                                     // Creating the click function

    if (!gameOn) {                                                                          // If 'gameOn' is false that means that the game is over
        return;                                                                             // If the game is over everytime we click an unit this condition will activate and every click will return nothing
    }

    if (gameUnits[index].classList.contains('checked') || gameUnits[index].classList.contains('flagged')) { // If the unit we are trying to click contains a class of 'checked' or 'flagged'
        return;                                                                                             // Everytime we click an unit containing those classes this condition will active and nothing will happen
    }

    if (mixedArray[index] == 'bomb') {                                                      // If the array index (which is the same as the div ID) contains the string 'bomb'
        gameOn = false;                                                                     // 'gameOn' is turned from 'true' to 'false'
        gameUnits[index].textContent = '💣';                                                // The 'bomb' icon will pe placed on that respective div
        gameUnits[index].style.backgroundColor = 'yellow';                                  // The background color will change from default to yellow
        showAllBombs();                                                                     // Calling 'show all bombs' function
    } else {                                                                                // If the array index (which is the same as the div ID) does not contain the string 'bomb'
        if (mixedArray[index] != 0) {                                                       // If the array index (which is the same as the div ID) is different than 0
            gameUnits[index].classList.add('checked');                                      // That respective div will get the class name 'checked'
            gameUnits[index].style.backgroundColor = '#5c5c5c';                             // The background color will change from default to dark grey
            gameUnits[index].innerHTML = mixedArray[index];                                 // Show the array element value within the div
            return;                                                                         // End the function
        }
        checkUnit(index);                                                                   // Calling the 'check unit' function
    }
}

function checkUnit(div) {                                                                   // Creating the 'check unit' function

    const leftEdge = (div % 10 == 0);                                                       // Creating a boolean value to see if we are clicking on a div that's on the left edge of the board
    const rightEdge = (div % 10 == 9);                                                      // Creating a boolean value to see if we are clicking on a div that's on the right edge of the board

    if (div > 0 && !leftEdge) {                                                             // If the div is greater than 0 and it's not on the left side        
        const newIndex = div - 1;                                                           // Creating a new variable that contains the number of the div to the left of the original div
        gameUnits[div].classList.add('checked');                                            // Add the class name 'checked' to that div
        gameUnits[div].style.backgroundColor = '#5c5c5c';                                   // The background color will change from default to dark grey
        click(newIndex)                                                                     // Calling the 'click' function with the new div value
    }

    if (div > 9 && !rightEdge) {                                                            // If the div is greater than 9 and it's not on the right side
        const newIndex = div + 1 - 10;                                                      // Creating a new variable that contains the number of the div above and to the right of the original div
        gameUnits[div].classList.add('checked');                                            // Add the class name 'checked' to that div
        gameUnits[div].style.backgroundColor = '#5c5c5c';                                   // The background color will change from default to dark grey
        click(newIndex);                                                                    // Calling the 'click' function with the new div value
    }

    if (div > 10) {                                                                         // If the div is greater than 10
        const newIndex = div - 10;                                                          // Creating a new variable that contains the number of the div above of the original div
        gameUnits[div].classList.add('checked');                                            // Add the class name 'checked' to that div
        gameUnits[div].style.backgroundColor = '#5c5c5c';                                   // The background color will change from default to dark grey
        click(newIndex);                                                                    // Calling the 'click' function with the new div value
    }

    if (div > 11 && !leftEdge) {                                                            // If the div is greater than 11 and it's not on the left side
        const newIndex = div - 1 - 10;                                                      // Creating a new variable that contains the number of the div above and to the left of the original div
        gameUnits[div].classList.add('checked');                                            // Add the class name 'checked' to that div
        gameUnits[div].style.backgroundColor = '#5c5c5c';                                   // The background color will change from default to dark grey
        click(newIndex);                                                                    // Calling the 'click' function with the new div value
    }

    if (div < 98 && !rightEdge) {                                                           // If the div is smaller than 98 and it's not on the right side
        const newIndex = div + 1;                                                           // Creating a new variable that contains the number of the div to the right of the original div
        gameUnits[div].classList.add('checked');                                            // Add the class name 'checked' to that div
        gameUnits[div].style.backgroundColor = '#5c5c5c';                                   // The background color will change from default to dark grey
        click(newIndex);                                                                    // Calling the 'click' function with the new div value
    }

    if (div < 90 && !leftEdge) {                                                            // If the div is smaller than 90 and it's not on the left side
        const newIndex = div - 1 + 10;                                                      // Creating a new variable that contains the number of the div below and to the left of the original div
        gameUnits[div].classList.add('checked');                                            // Add the class name 'checked' to that div
        gameUnits[div].style.backgroundColor = '#5c5c5c';                                   // The background color will change from default to dark grey
        click(newIndex);                                                                    // Calling the 'click' function with the new div value
    }

    if (div < 88 && !rightEdge) {                                                           // If the div is smaller than 88 and it's not on the right side
        const newIndex = div + 1 + 10;                                                      // Creating a new variable that contains the number of the div above and to the right of the original div
        gameUnits[div].classList.add('checked');                                            // Add the class name 'checked' to that div
        gameUnits[div].style.backgroundColor = '#5c5c5c';                                   // The background color will change from default to dark grey
        click(newIndex);                                                                    // Calling the 'click' function with the new div value
    }

    if (div < 89) {                                                                         // If the div is smaller than 89
        const newIndex = div + 10;                                                          // Creating a new variable that contains the number of the div above of the original div
        gameUnits[div].classList.add('checked');                                            // Add the class name 'checked' to that div
        gameUnits[div].style.backgroundColor = '#5c5c5c';                                   // The background color will change from default to dark grey
        click(newIndex);                                                                    // Calling the 'click' function with the new div value
    }
}

function showAllBombs() {                                                                   // Creating 'show all bombs' function

    for (let i = 0; i < 100; ++i) {                                                         // Loop throw all the divs
        if (mixedArray[i] == 'bomb') {                                                      // If the index of that div that coresponds to the index of the element from the array contains a bomb
            clearInterval(chronometer);                                                     // Stop to in game timer
            gameUnits[i].textContent = '💣';                                               // The 'bomb' icon will pe placed on that respective div 
            gameUnits[i].style.backgroundColor = 'yellow';                                  // The background color will change from default to yellow
            bombs.textContent = 'You Lost! 💥'                                             // Change the bomb count to show 'You lost' text
        }
    }
}

function checkForFlaggedBombs() {                                                           // Creating 'check for flagged bombs'
    let total = 0;                                                                          // Creating a total varial for the CORRECTLY flagged bombs

    for (let i = 0; i < 100; ++i) {                                                         // Loop throw all the divs
        if (gameUnits[i].classList.contains('flagged') && mixedArray[i] == 'bomb') {        // If the respectiv div we are looping over contains the class name 'flagged' and the array element with the same index contains the string 'bomb'
            ++total;                                                                        // Increment the 'total' variable
        }
    }

    if (total == 20 && totalBombs == 0) {                                                   // If the total of flags is 20 and the total bombs count is 0
        for (let i = 0; i < 100; ++i) {                                                     // Loop throw all the dics
            if (mixedArray[i] != 'bomb') {                                                  // If the respectiv div we are looping over and the array element with the same index does not contain the string 'bomb'
                clearInterval(chronometer);                                                 // Stio the in game timer
                gameUnits[i].textContent = '🥇';                                            // Replace all divs expect tha ones containing the bombs with the medal icon
                bombs.textContent = 'You Won! 🏆';                                          // Replace bomb counter text with 'You won!'
            }
        }
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

resetBtn.addEventListener('click', function () {                                            // The Reset button will reload the page and reset everything
    location.reload();
})


