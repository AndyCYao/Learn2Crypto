// bank.js
var jsonStream = require('duplex-json-stream')
var net = require('net')

var log = []
var currentBalance = 0

function reduceLog (balance, entry) {
  return balance + entry.amount
}

var server = net.createServer(function (socket) {
  socket = jsonStream(socket)
  
  socket.on('data', function (msg) {
    switch(msg["cmd"]){
      case 'deposit':
        currentBalance += msg.amount
        log.push(msg)
        var payload = {cmd : 'balance', balance : log.reduce(reduceLog, 0)}
        break
      case 'balance':
        var payload = {cmd : 'balance', balance : log.reduce(reduceLog, 0)}
        break
      case 'withdraw':
        if(currentBalance >= msg.amount){
          currentBalance -= msg.amount
          msg.amount = -1 * msg.amount
          log.push(msg)
          var payload = {cmd : 'balance', balance : log.reduce(reduceLog, 0)}
        }
        else{
          var payload = "Insufficient Fund"
        }

        break
      default:
        break
    }
    socket.write(payload)
  })
})

server.listen(3876)