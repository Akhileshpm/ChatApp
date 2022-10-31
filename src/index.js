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

    socket.on('sendMessage', (message, callback)=>{
        io.emit('message', message);
        callback('delivered');
    })

    socket.on('sendLocation',(locationData, callback)=>{
        io.emit('locationPublic',`https://google.com/maps?q=${locationData.latitude},${locationData.longitude}`);
        callback();
    })
    socket.on('disconnect', ()=>{
        io.emit('message', 'Someone left the chat');
    })
})

app.use(express.static(publicDirectoryPath));

server.listen(port, ()=>{
    console.log(`server is up on ${port} `);
})
