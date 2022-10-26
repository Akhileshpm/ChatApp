const socket = io();

socket.on('message', (message)=>{
    console.log(message);
})

document.getElementById('submit-button').addEventListener('click',(e)=>{
    e.preventDefault();

    const message = document.getElementById('textarea').value;
    socket.emit('sendMessage', message);
})

document.getElementById('send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation is not supported by your browser!!!');
    }

    //navigator does not have the support for promises API hence using a callback function.
       navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendLocation',{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        })
})