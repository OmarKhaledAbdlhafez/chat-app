const socket=io()
const from = document.querySelector('form')
const search = document.querySelector('input')
const messages =document.querySelector('#messages')
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('welcome',(msg)=>{
  console.log(msg);
})
from.addEventListener('submit',(e)=>{
    e.preventDefault()
  const msg = search.value
  socket.emit('sendMessage',msg,()=>{
    search.value=""
    search.focus()
    console.log('done ');
  })
})
socket.on('showmsg',(msg)=>{
  console.log(msg.text);
  const html = Mustache.render(messageTemplate, {
        username:msg.username,
        message:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})
