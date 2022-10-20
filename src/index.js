const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

let count = 1;
io.on('connection', (socket)=>{
    console.log("new connection");

    socket.emit('countUpdated', count);
    socket.on('incremented', () => {
        count++;
        io.emit('countUpdated', count);
    })
})

app.use(express.static(publicDirectoryPath));

server.listen(port, ()=>{
    console.log(`server is up on ${port} `);
})
