const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const socketio = require('socket.io')
const io = socketio(server)

const PORT = process.env.PORT || 8080

app.use(express.static('./public'))

io.on('connection', (socket) => {
    console.log('New connection!')

    socket.on('joinRoom', (roomName) =>{
        socket.join(roomName)

        socket.broadcast.to(roomName).emit('message' ,'Someone has joined the room!')

        socket.on('disconnect', () => {
            io.to(roomName).emit('message', 'Disconnection detected!')
        })
    })

    socket.emit('message', 'Hello!')
})

server.listen(PORT, () => console.log(`Live on port ${PORT}`))