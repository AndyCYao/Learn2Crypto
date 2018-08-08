// bank.js
var jsonStream = require('duplex-json-stream')
var net = require('net')

var log = []

function reduceLog (balance, entry) {
  return balance + entry.amount
}

var server = net.createServer(function (socket) {
  socket = jsonStream(socket)
  
  socket.on('data', function (msg) {
    switch(msg["cmd"]){
      case 'deposit':
        log.push(msg)
        break
      case 'balance':
        break
      default:
        break
    }
    
    var payload = {cmd : 'balance', balance : log.reduce(reduceLog, 0)}
    socket.write(payload)
  })
})

server.listen(3876)