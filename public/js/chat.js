const socket = io();
const submitButton = document.getElementById('submit-button');
const textArea = document.getElementById('textarea');
const locationButton = document.getElementById('send-location');
const messages = document.getElementById('messages');
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
//template
const messageTemplate = document.getElementById('message-template').innerHTML;


const autoScroll = () => {
    // const newMessage = messages.lastElementChild;

    // const newMessageStyles = getComputedStyle(newMessage);
    // const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    // const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    // const visibleHeight = messages.offsetHeight;
    // const containerHeight = messages.scrollHeight;
    // // how far we have scrolled
    // const scrollOffset = messages.scrollTop + visibleHeight;

    // if(containerHeight - newMessageHeight <= scrollOffset){
    //     messages.scrollTop = messages.scrollHeight;
    // }
        // New message element
        const $newMessage = messages.lastElementChild

        // Height of the new message
        const newMessageStyles = getComputedStyle($newMessage)
        const newMessageMargin = parseInt(newMessageStyles.marginBottom)
        const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    
        // Visible height
        const visibleHeight = messages.offsetHeight
    console.log(visibleHeight)
        // Height of messages container
        const containerHeight = messages.scrollHeight
    console.log(containerHeight)
        // How far have I scrolled?
        console.log(messages.scrollTop);
        const scrollOffset = messages.scrollTop + visibleHeight
    
        // if (containerHeight - newMessageHeight <= scrollOffset) {
        //     console.log("res")
        //     messages.scrollTop = messages.scrollHeight
        //     console.log(messages.scrollHeight, messages.scrollTop);
        // }

        if(Math.round(containerHeight - newMessageHeight) <= Math.round(scrollOffset)){
            messages.scrollTop = messages.scrollHeight;
        }
}

socket.on('message', (message)=>{
    
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

const { username, roomname} = Qs.parse(location.search, { ignoreQueryPrefix: true});

socket.on('locationPublic', (location) => { 

    const html = `<div class="location-box ${location.username}"><p>${location.username}</p><span class="createdAt">${moment(location.createdAt).format('h:mm a')}</span>&nbsp &nbsp<button id=${location.text+location.createdAt} class="button-34" role="button" >View location</button><div><br>`;
    messages.insertAdjacentHTML('beforeend', html);
    autoScroll();

    document.getElementById(`${location.text+location.createdAt}`).addEventListener('click', ()=>{
        window.open(location.text);
    })
})
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        users,
        room
    })
    document.getElementById('sidebar').innerHTML = html;
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