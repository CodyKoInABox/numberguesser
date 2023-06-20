let currentPlay = 1

const socket = io()
socket.emit('joinRoom', getRoomName())

socket.on('message', (message) => {
    console.log(message)
})

//this event fires when a user connects or disconnects, it logs the amount of users and ends the game if there's the amount of players is different than 2
//i should probably change this later and create a system to lock the room if there are two players
//but for now this will do it =)
socket.on('userCount', (message) => {
    console.log(message.content + ' | User count: ' + message.userCount)
    if(message.userCount != 2){
        window.location.href = window.location.origin + '/play/notenoughplayers'
    }else{
        socket.emit('gameReady')
        startGame()
    }
})
socket.on('startGame', () => {
    startGame()
})

socket.on('otherPlayerIsReady', () =>{
    otherPlayerChoseTheirNumber()
    checkIfBothPlayerHaveChosen()
})

socket.on('otherPlayerGuess', (guess) => {
    otherPlayerGuess(guess)
})

socket.on('guessIsCorrect', (guess) => {
    correctGuess(guess)
})

socket.on('guessIsWrong', (guess) => {
    wrongGuess(guess)
})

function getRoomName(){
    return new URLSearchParams(window.location.search).get('room') || undefined
}


//-------------------------------------//
// ONLY GAME LOGIC UNDER THIS COMMENT //
//-----------------------------------//

let chosenNumber = 0

//POSSIBLE STATES:
// waiting -> Waiting for second player to join
// choosing -> For when both players are choosing a number
// guessing -> For when both players are guessing
let currentState = 'waiting'

let havePlayerChosen = false
let haveOtherPlayerChosen = false

let havePlayerGuessed = false
let haveOtherPlayerGuessed = false
//i should probably change this name
//later =)
function pushNumberToPlayStack(number){
    currentPlay = number
    console.log('Current play: ' + currentPlay)
}

function getLatestPlay(){
    return currentPlay
}

//by default the HTML displays the WAITING FOR PLAYER state, this function changes that to the choose number state
function startGame(){
    currentState = 'choosing'

    changeRightStateText('OTHER PLAYER IS CHOOSING A NUMBER')
    makeRightButtonsNotClickable()
    makeRightConfirmButtonNotClickable()

    changeLeftStateText('CHOOSE A NUMBER')
    makeLeftButtonsClickable()
    makeLeftConfirmButtonClickable()
    
}


//when right confirm button is clicked
function rightConfirmButtonIsClicked(){
    switch(currentState){
        case 'guessing':
            playerGuessedANumber()
            checkIfBothPlayerHaveGuessed()
        break;
    }
}

//when left confirm button is clicked
function leftConfirmButtonIsClicked(){
    switch(currentState){
        case 'choosing':
            playerChooseTheirNumber()
            havePlayerChosen = true
            checkIfBothPlayerHaveChosen()
        break;

    }
}

//check if both players have chosen a number and if true start guessing phase
function checkIfBothPlayerHaveChosen(){
    if(havePlayerChosen && haveOtherPlayerChosen){
        readyToStartGuessing()
        currentState = 'guessing'
    }
}

//check if both players have guessed in that round
function checkIfBothPlayerHaveGuessed(){
    if(havePlayerGuessed && haveOtherPlayerGuessed){
        //start new round
        havePlayerGuessed = false
        haveOtherPlayerGuessed = false
    }
}

//when both players have chosen a number
function readyToStartGuessing(){
    makeRightButtonsClickable()
    changeRightStateText("GUESS THE OTHER PLAYER'S NUMBER") 
    makeRightConfirmButtonClickable()

    changeLeftStateText('OTHER PLAYER IS GUESSING')
    changeLeftInfoText('YOUR NUMBER IS ' + currentPlay)
    chosenNumber = currentPlay
}

//when the player guesses a number
function playerGuessedANumber(){
    socket.emit('guess', currentPlay)
    havePlayerGuessed = true
}

//when the other player makes a guess
function otherPlayerGuess(guess){
    let isGuessHigher
    if(guess > chosenNumber){
        isGuessHigher = true
    }else{
        isGuessHigher = false
    }

    if(guess == chosenNumber){
        socket.emit('correctGuess', {'guess': guess, 'isGuessHigher': isGuessHigher})
    }else{
        socket.emit('wrongGuess', {'guess': guess, 'isGuessHigher': isGuessHigher})
    }
    haveOtherPlayerGuessed = true
}

//when player's guess is correct
function correctGuess(guess){
    //END GAME WITH WIN
    console.log('CORRECT GUESS')
}

//when player's guess is wrong
function wrongGuess(guess){
    console.log('WRONG GUESS')
}

//when the player chooses a number
function playerChooseTheirNumber(){
    socket.emit('chosenNumber', {'number': currentPlay, 'playerID': socket.id})
    makeLeftButtonsNotClickable()
    makeLeftConfirmButtonNotClickable()
    document.getElementById('left' + currentPlay).style.backgroundColor = 'hsl(187, 71%, 60%)'
}

//when the OTHER player has choosen their number
function otherPlayerChoseTheirNumber(){
    changeRightStateText('OTHER PLAYER HAS CHOSEN A NUMBER')
    haveOtherPlayerChosen = true
}

//make right buttons clickable
function makeRightButtonsClickable(){
    let numberRight = document.getElementsByClassName('numberRight')
    for(let i = 0; i < numberRight.length; i++){
        numberRight[i].style.pointerEvents = 'all';
        numberRight[i].style.backgroundColor = '#E9EB87';
    }
}

//make right buttons NOT clickable
function makeRightButtonsNotClickable(){
    let numberRight = document.getElementsByClassName('numberRight')
    for(let i = 0; i < numberRight.length; i++){
        numberRight[i].style.pointerEvents = 'none';
        numberRight[i].style.backgroundColor = '#8d8d8d';
    }
}

//make left buttons clickable
function makeLeftButtonsClickable(){
    let numberLeft = document.getElementsByClassName('numberLeft')
    for(let i = 0; i < numberLeft.length; i++){
        numberLeft[i].style.pointerEvents = 'all';
        numberLeft[i].style.backgroundColor = '#E9EB87';
    }
}

//make left buttons NOT clickable
function makeLeftButtonsNotClickable(){
    let numberLeft = document.getElementsByClassName('numberLeft')
    for(let i = 0; i < numberLeft.length; i++){
        numberLeft[i].style.pointerEvents = 'none';
        numberLeft[i].style.backgroundColor = '#8d8d8d';
    }
}

//make right confirm button clickable
function makeRightConfirmButtonClickable(){
    document.getElementById('rightConfirm').style.pointerEvents = 'all';
}

//make right confirm button NOT clickable
function makeRightConfirmButtonNotClickable(){
    document.getElementById('rightConfirm').style.pointerEvents = 'none';
}


//make left confirm button clickable
function makeLeftConfirmButtonClickable(){
    document.getElementById('leftConfirm').style.pointerEvents = 'all';
}

//make left confirm button NOT clickable
function makeLeftConfirmButtonNotClickable(){
    document.getElementById('leftConfirm').style.pointerEvents = 'none';
}


//make both confirm buttons clickable
function makeConfirmButtonsClickable(){
   let confirmButtons = document.getElementsByClassName('confirmButton')
   for(let i = 0; i < confirmButtons.length; i++){
    confirmButtons[i].style.pointerEvents = 'all';
    }
}

//make both confirm buttons NOT clickable
function makeConfirmButtonsNotClickable(){
    let confirmButtons = document.getElementsByClassName('confirmButton')
    for(let i = 0; i < confirmButtons.length; i++){
     confirmButtons[i].style.pointerEvents = 'none';
     }
 }

//change right state text
function changeRightStateText(newStateText){
    document.getElementById('rightState').innerText = newStateText
}

//change left state text
function changeLeftStateText(newStateText){
    document.getElementById('leftState').innerText = newStateText
}

//update left number button when it's clicked
function rightNumberButtonIsClicked(buttonNumber){
    let numberRight = document.getElementsByClassName('numberRight')

    for(let i = 0; i < numberRight.length; i++){
        numberRight[i].style.boxShadow = '0px 0.335vh rgb(0, 0, 0, 0.3)';
        numberRight[i].style.backgroundColor = '#E9EB87';
    }
    
    let currentButton = document.getElementById('right' + buttonNumber)
    currentButton.style.boxShadow = '0px 0vh rgb(0, 0, 0, 0)';
    currentButton.style.backgroundColor = 'hsl(187, 71%, 60%)';
}

//update right number button when it's clicked
function leftNumberButtonIsClicked(buttonNumber){
    let numberLeft = document.getElementsByClassName('numberLeft')
    for(let i = 0; i < numberLeft.length; i++){
        numberLeft[i].style.boxShadow = '0px 0.335vh rgb(0, 0, 0, 0.3)';
        numberLeft[i].style.backgroundColor = '#E9EB87';
    }
    
    let currentButton = document.getElementById('left' + buttonNumber)
    currentButton.style.boxShadow = '0px 0vh rgb(0, 0, 0, 0)';
    currentButton.style.backgroundColor = 'hsl(187, 71%, 60%)';
}

//change right info text
function changeRightInfoText(newInfoText){
    document.getElementById('rightInfo').innerText = newInfoText
}

//change left info text
function changeLeftInfoText(newInfoText){
    document.getElementById('leftInfo').innerText = newInfoText
}