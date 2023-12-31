const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const socketio = require('socket.io')
const io = socketio(server)

const PORT = process.env.PORT || 8080

app.use(express.static('./public'))

io.on('connection', (socket) => {

    socket.on('joinRoom', (roomName) =>{
        socket.join(roomName)

        try{
            socket.to(roomName).emit('userCount' ,{'content': 'Someone joined', 'userCount': io.sockets.adapter.rooms.get(roomName).size})
        }catch(e){
            socket.broadcast.to(roomName).emit('message', {'message' : 'Error while calculating the user count', 'error' : e})
        }

        socket.on('gameReady', () => {
            socket.broadcast.to(roomName).emit('startGame')
        })

    
        socket.on('chosenNumber', (data) => {
            socket.broadcast.to(roomName).emit('otherPlayerIsReady')
        })

        socket.on('readyToGuess', () => {
            socket.broadcast.to(roomName).emit('bothPlayersAreReady')
        })

        socket.on('guess', (guess) => {
            socket.broadcast.to(roomName).emit('otherPlayerGuess', guess)
        })

        socket.on('correctGuess', (guess) => {
            socket.broadcast.to(roomName).emit('guessIsCorrect', {'guess': guess.guess, 'isGuessHigher': guess.isGuessHigher})
        })

        socket.on('wrongGuess', (guess) => {
            socket.broadcast.to(roomName).emit('guessIsWrong', {'guess': guess.guess, 'isGuessHigher': guess.isGuessHigher})
        })

        socket.on('disconnect', () => {
            //io.to(roomName).emit('message', 'Disconnection detected!')
            try{
                socket.broadcast.to(roomName).emit('userCount' ,{'content': 'Someone disconnect', 'userCount': io.sockets.adapter.rooms.get(roomName).size})
            }catch(e){
                socket.broadcast.to(roomName).emit('message', {'message' : 'Error while calculating the user count', 'error' : e})
            }finally{
            }
        })
    })

    socket.emit('message', 'Hello!')
})

server.listen(PORT, () => console.log(`Live on port ${PORT}`))


//-------------------------------------//
// ONLY GAME LOGIC UNDER THIS COMMENT //
//-----------------------------------//


function isRoomFull(roomName){
    return io.sockets.adapter.rooms.get(roomName).size == 2
}
