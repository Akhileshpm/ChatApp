const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const {generateMessage} = require("./utils/messages");
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

io.on('connection', (socket)=>{
    console.log("new connection");

    socket.on('join', ({username, roomname}, callback) => {

        const { error, user } = addUser({id: socket.id, username, room: roomname});

        if(error){
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('message',generateMessage('FreeChat','Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined the chats!`));

        callback();
    })
    
    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id);

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback('delivered');
    })

    socket.on('sendLocation',(locationData, callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('locationPublic',generateMessage(user.username, `https://google.com/maps?q=${locationData.latitude},${locationData.longitude}`));
        callback();
    })
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', generateMessage(`${user.username} left the chat`));
        }
    })

})

app.use(express.static(publicDirectoryPath));

server.listen(port, ()=>{
    console.log(`server is up on ${port} `);
})
