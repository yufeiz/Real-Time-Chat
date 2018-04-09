const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const userRouter = require('./user')
const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')
io.on('connection', function(socket) {
  socket.on('sendmsg', function(data) {
    const from = data.from
    const to = data.to
    const msg = data.msg
    const chatid = [from, to].sort().join('_')
    Chat.create({chatid, from, to, content:msg}, function(err, doc) {
      io.emit('recvmsg', Object.assign({}, doc._doc))
    })
    // console.log(data);
    // io.emit('recvmsg', data)
  })
})
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/user', userRouter)
server.listen(9093, function() {
  console.log('Node app start at port 9093')
})
