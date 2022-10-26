const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

io.on('connection', (socket)=>{
    console.log("new connection");

    socket.emit('message','welcome!');
    socket.broadcast.emit('message', 'A new user has joined the chat');

    socket.on('sendMessage', (message)=>{
        io.emit('message', message);
    })

    socket.on('sendLocation',(locationData)=>{
        io.emit('message',`Location: ${locationData.latitude}, ${locationData.longitude}`)
    })
    socket.on('disconnect', ()=>{
        io.emit('message', 'Someone left the chat');
    })
})

app.use(express.static(publicDirectoryPath));

server.listen(port, ()=>{
    console.log(`server is up on ${port} `);
})
