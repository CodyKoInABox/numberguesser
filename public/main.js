const socket = io()
socket.emit('joinRoom', getRoomName())

socket.on('message', (message) => {
    console.log(message)
})

function joinRoom(roomName){
    window.location.href = window.location.href + '/play?room=' + roomName
}

function getRoomName(){
    return new URLSearchParams(window.location.search).get('room') || undefined
}