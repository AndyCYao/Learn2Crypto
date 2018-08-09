// bank.js

var jsonStream = require('duplex-json-stream')
var net = require('net')

const fs = require('fs');

var log = require('./transactions.json');
console.log(typeof(log))
console.log(log)

var currentBalance = log.reduce(reducer, 0)

function reducer (balance, entry) {
  return balance + entry.amount
}

var server = net.createServer(function (socket) {
  socket = jsonStream(socket)
  
  socket.on('data', function (msg) {
    isSufficient = true
    switch(msg["cmd"]){
      case 'deposit':
        currentBalance += msg.amount
        log.push(msg)

        break
      case 'balance':

        break
      case 'withdraw':
        if(currentBalance >= msg.amount){
          currentBalance -= msg.amount
          msg.amount = -1 * msg.amount
          log.push(msg)
          
        }
        else{
          isSufficient = false
        }

        break
      default:
        break
    }
    if(isSufficient){
      var payload = {cmd : 'balance', balance : log.reduce(reducer, 0)}
      fs.writeFile('transactions.json', JSON.stringify(log, null, 1), (error) => { /* handle error */ })
    } 
    else{
      var payload = "Insufficient fund"
    }
    socket.write(payload)
  })
})
//server.end(JSON.stringify(log))
server.listen(3876)