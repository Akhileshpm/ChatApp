const socket = io();

socket.on('countUpdated', (count)=>{
    console.log("new count", count);
});

document.getElementById("increment").addEventListener('click',()=>{
    console.log("clicked");
    socket.emit('incremented');
})

