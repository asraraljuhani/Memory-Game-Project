//Variable Declaration
let indexShowCard = -1;
let tempCard = new Array(2);
let countchoseenCards = -1;
let Cards = document.getElementsByClassName('card');
let randomcard = new Array(16);
let counterMoves = -1;
let Stars = document.getElementsByClassName('stars').item(0).children;;
let timer = new easytimer.Timer();
//call function start when the page load 
start();
/**
@description function will initial variables of time and stars and call shuffle cards and show it to the player for five seconds then close it. 
*/
function start() {

    Stars.item(2).children.item(0).className = "fa fa-star";
    Stars.item(1).children.item(0).className = "fa fa-star";
    Stars.item(0).children.item(0).className = "fa fa-star";
    timer.reset();
    timer.stop();
    document.querySelector('.timer').textContent = "00:00:00";
    indexShowCard = -1;
    countchoseenCards = -1;
    counterMoves = -1;
    MovesCounter();
    for (let i = 0; i < randomcard.length; i++) {
        randomcard[i] = Cards.item(i).childNodes.item(1).className;
    }
    randomcard = shuffle(randomcard);
    for (let i = 0; i < randomcard.length; i++) {
        Cards.item(i).childNodes.item(1).className = randomcard[i];
    }
    document.querySelectorAll('.card').forEach((element) => {
        element.className = 'card';
    });
    document.querySelectorAll('.card').forEach((element) => {
        element.className = 'card open show';
    });
    //close the cards 
    setTimeout(function () {
        document.querySelectorAll('.card').forEach((element) => {
            element.className = 'card';
        });
    }, 5000);
}


/**
@description event listener to update the time of the timer in the page.
@param {secondsUpdated} to update the timer 
@param {function} function to update the time on the page
*/
timer.addEventListener('secondsUpdated', function () {
    document.querySelector('.timer').textContent = timer.getTimeValues().toString();
});
/**
@description function to update the stars depends on the movements 
@param {counterMoves} counter of movements to update the stars on it  
*/
function UpdateStars(counterMoves) {

    if ((counterMoves > 8) && (counterMoves <= 10)) {
        Stars.item(2).children.item(0).className = 'fa fa-star-half-empty';
    }
    if ((counterMoves > 11) && (counterMoves <= 15)) {
        Stars.item(2).children.item(0).className = 'fa fa-star-o';
    }
    if ((counterMoves > 16) && (counterMoves <= 20)) {
        Stars.item(2).children.item(0).className = 'fa fa-star-o';
        Stars.item(1).children.item(0).className = 'fa fa-star-half-empty';
    }
    if (counterMoves > 21) {
        Stars.item(2).children.item(0).className = 'fa fa-star-o';
        Stars.item(1).children.item(0).className = 'fa fa-star-o';
    }


}

/**
@description event listener if the player clicked on the page, if the player click on a card will check if it was first card clicked on it will let timer start otherwise will open the card and check from it by call CardsClicked function, if the player clicked on repeat button will initial variables and call start function to start again. 
@param {element} element of the card in the page 
*/
document.body.addEventListener('click', function (event) {

    let element = event.target
    if (element.className === 'card') {
        if (counterMoves === 0) {
            timer.start();
        }
        element.className = 'card open show';
        MovesCounter();
        CardsClicked(element);
    }
    if (element.className === 'fa fa-repeat') {
        tempCard[0] = null;
        tempCard[1] = null;
        countchoseenCards = -1;
        counterMoves = -1;
        MovesCounter();
        document.querySelectorAll('.card .open .show').forEach((element) => {
            element.className = 'card';
        });
        start();
    }
});
/**
@description function to check the cards that the player choosed if it matched or not, if it matched will call ShowCards function , if not matched will close the cards, if the player choose one card will save the card to temp array of the cards that the player choose it to compare between them if it match or not later, also if the player choose two cards will prevent from choose another cards in the same time until close the cards or show if it matched. 
@param {element} element of the card in the page 
*/
function CardsClicked(element) {
    countchoseenCards++;
    if (countchoseenCards < 2) {
        tempCard[countchoseenCards] = element;
    }
    if (countchoseenCards === 1) {
        if (tempCard[0].firstElementChild.className === tempCard[1].firstElementChild.className) {
            ShowCards(tempCard[0]);
            ShowCards(tempCard[1]);
            tempCard[0] = null;
            tempCard[1] = null;
            countchoseenCards = -1;
        } else {
            let CardStopEvent = function (event) {
                event.stopPropagation();
                event.preventDefault();
            };
            document.querySelector('.deck').addEventListener('click', CardStopEvent, false);
            setTimeout(function () {
                tempCard[0].className = 'card';
                tempCard[1].className = 'card';
                tempCard[0] = null;
                tempCard[1] = null;
                countchoseenCards = -1;
                document.querySelector('.deck').removeEventListener('click', CardStopEvent, false);
            }, 1000);
        }
    }
}
/**
@description function to show the cards that is matched and count the cards is matched and if the cards that matched 15 (win in the game) will call function WiningPop .
*/
function ShowCards(element) {
    if (indexShowCard < 16) {
        indexShowCard++;
        element.className = 'card match';
    }
    if (indexShowCard === 15) {
        WiningPop();
    }
}
/**
@description function show pop alart when the player wining in the game and give the player details about time he took it and stars and movements to won and give him also two option play again or exit from the game.
@returns {function} start() if the player choose button Try Again
@returns {function} cancel the pop alart and back to the game 
*/
function WiningPop() {
    let Time = time();
    timer.stop();
    var WinText = "Win in " + counterMoves + " Moves and in" + Time + " and you took " + Stars.item(0).innerHTML + Stars.item(1).innerHTML + Stars.item(2).innerHTML + " Stars Wooow!! ";

    $.sweetModal({
        title: 'Congratulation! You Won!',
        content: WinText,
        icon: $.sweetModal.ICON_SUCCESS,

        buttons: {
            someOtherAction: {
                label: 'Try Again',
                classes: 'greenB',
                action: function () {
                    start();
                }
            },

            someAction: {
                label: 'Exit',
                classes: 'secondaryB',
                action: function () {
                    return confirm.cancel
                }
            },
        }

    });
}
/**
@description function to count the movements that the player do it and updated on the page .
*/
function MovesCounter() {
    counterMoves++;
    document.querySelector('.score-panel .moves').textContent = counterMoves;
    UpdateStars(counterMoves);
}
/**
@description function to give the time that the player had it.
@returns {string} time of player
*/
function time() {
    let valueOfTime = 0;
    if ((timer.getTimeValues().days === 0) && (timer.getTimeValues().hours === 0) && (timer.getTimeValues().minutes === 0)) {
        valueOfTime = " " + timer.getTimeValues().seconds + " seconds";
    } else if ((timer.getTimeValues().days === 0) && (timer.getTimeValues().hours === 0)) {
        valueOfTime = " " + timer.getTimeValues().minutes + " minutes and " + timer.getTimeValues().seconds + " seconds";
    } else if ((timer.getTimeValues().days === 0) && (timer.getTimeValues().hours !== 0)) {
        valueOfTime = " " + timer.getTimeValues().hours + " hours and " + timer.getTimeValues().minutes + " minutes and " + timer.getTimeValues().seconds + " seconds";
    }

    return valueOfTime;
}
/**
@description shuffle the cards
@param {array} array
@returns {array} array shuffled the content
Shuffle function from http://stackoverflow.com/a/2450976
*/
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}