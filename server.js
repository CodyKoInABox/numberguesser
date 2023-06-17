const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)

const socketio = require('socket.io')
const io = socketio(server)

const PORT = 8080 || process.env.PORT

app.use(express.static('./public'))

io.on('connection', (socket) => {
    console.log('New connection!')
})

server.listen(PORT, () => console.log(`Live on port ${PORT}`))