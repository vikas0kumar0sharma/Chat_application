require('dotenv').config({ override: true })
const express=require('express')
const path=require('path')
const PORT=process.env.PORT||4000
const app=express()

const server=app.listen(PORT,()=>console.log(`💬 running on PORT ${PORT}`))

const io=require('socket.io')(server)

app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
  return res.redirect('index.html')
})

// every time new socket id will be generated
io.on('connection',onConnected)

const socketConnected=new Set()

function onConnected(socket){
  console.log(socket.id)
  socketConnected.add(socket.id)

  io.emit('clients-total',socketConnected.size)

  socket.on('disconnect',()=>{
    console.log('socket disconnected : ',socket.id)
    socketConnected.delete(socket.id)
    io.emit('clients-total',socketConnected.size)
  })

  socket.on('message',(data)=>{
    console.log(data)
    socket.broadcast.emit('chat-message',data)
  })

  socket.on('feedback',(data)=>{
    socket.broadcast.emit('feedback',data)
  })
}
