const socket = io()
const clientsTotal = document.getElementById('clients-total')

var messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone=new Audio('/message-tone.mp3')

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  sendMessage()
})

socket.on('clients-total', (data) => {
  clientsTotal.innerText = `Total Clients : ${data}`
})

socket.on('chat-message', (data) => {
  addMessageToUi(false, data)
})

function sendMessage() {
  if (messageInput.value === '') return
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date()
  }
  socket.emit('message', data)
  addMessageToUi(true, data)
  messageInput.value = ''
  messageTone.play()
}

function addMessageToUi(isOwnMessage, data) {
  clearFeedback()
  var ele = `
  <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
    <p id="message" class="message">
      ${data.message}
      <span>${data.name} ⚫ ${moment(data.dateTime).fromNow()}</span>
     </p>
  </li>`
  messageContainer.innerHTML += ele
  scrollToBottom()
}

function scrollToBottom() {
  messageContainer.scroll(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} is typing...`
  })
})

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} is typing...`
  })
})

messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: ''
  })
})

socket.on('feedback', (data) => {
  clearFeedback()
  const ele = `
  <li class="message-feedback">
    <p class="feedback" id="feedback">
      ${data.feedback}
    </p>
  </li>`

  messageContainer.innerHTML+=ele
  scrollToBottom()
})

function clearFeedback(){
  document.querySelectorAll('li.message-feedback').forEach(element=>{
    element.parentNode.removeChild(element)
  })
}