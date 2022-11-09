const socket = io();



const submitButton = document.getElementById('submit-button');
const textArea = document.getElementById('textarea');
const locationButton = document.getElementById('send-location');
const messages = document.getElementById('messages');

//template
const messageTemplate = document.getElementById('message-template').innerHTML;

socket.on('message', (message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML('beforeend', html);
})

const { username, roomname} = Qs.parse(location.search, { ignoreQueryPrefix: true});

socket.on('locationPublic', (location) => { 

    const html = `<div class="location-box" ><span class="createdAt">${moment(location.createdAt).format('h:mm a')}</span><button id=${location.text+location.createdAt} class="button-34" role="button" >View location</button><div><br>`;
    messages.insertAdjacentHTML('beforeend', html);

    document.getElementById(`${location.text+location.createdAt}`).addEventListener('click', ()=>{
        window.open(location.text);
    })
})

submitButton.addEventListener('click',(e)=>{
    e.preventDefault();

    submitButton.setAttribute('disabled', 'disabled');

    const message = textArea.value;
    socket.emit('sendMessage', message, (msg) => {

        submitButton.removeAttribute('disabled');
        textArea.value = '';
        textArea.focus();
        console.log("message was delivered", msg);
    });
})

locationButton.addEventListener('click',() => {
    if(!navigator.geolocation){
        return alert('geolocation is not supported by your browser!!!');
    }

    locationButton.setAttribute('disabled', 'disabled')
    //navigator does not have the support for promises API hence using a callback function.
       navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendLocation',{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },() => {
                locationButton.removeAttribute('disabled');
                console.log("Location made public!")
            })
        })
})

socket.emit('join', {username, roomname}, (error) => {
    if(error){
        alert(error);
        location.href = '/';
    }
});