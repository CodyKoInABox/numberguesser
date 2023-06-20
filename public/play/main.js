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
        startGame()
    }
})

function getRoomName(){
    return new URLSearchParams(window.location.search).get('room') || undefined
}


//-------------------------------------//
// ONLY GAME LOGIC UNDER THIS COMMENT //
//-----------------------------------//

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
    
    changeRightStateText('OTHER PLAYER IS CHOOSING HIS NUMBER')
    changeLeftStateText('CHOOSE A NUMBER')
    
}



//make right buttons clickable
function makeRightButtonsClickable(){
    let numberRight = document.getElementsByClassName('numberRight')
    for(let i = 0; i < numberRight.length; i++){
        numberRight[i].style.pointerEvents = 'all';
    }
}

//make right buttons NOT clickable
function makeRightButtonsNotClickable(){
    let numberRight = document.getElementsByClassName('numberRight')
    for(let i = 0; i < numberRight.length; i++){
        numberRight[i].style.pointerEvents = 'none';
    }
}

//make left buttons clickable
function makeLeftButtonsClickable(){
    let numberLeft = document.getElementsByClassName('numberLeft')
    for(let i = 0; i < numberLeft.length; i++){
        numberLeft[i].style.pointerEvents = 'all';
    }
}

//make left buttons NOT clickable
function makeLeftButtonsNotClickable(){
    let numberLeft = document.getElementsByClassName('numberLeft')
    for(let i = 0; i < numberLeft.length; i++){
        numberLeft[i].style.pointerEvents = 'none';
    }
}

//make confirm buttons clickable
function makeConfirmButtonsClickable(){
   let confirmButtons = document.getElementsByClassName('confirmButton')
   for(let i = 0; i < confirmButtons.length; i++){
    confirmButtons[i].style.pointerEvents = 'all';
    }
}

//make confirm buttons NOT clickable
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
