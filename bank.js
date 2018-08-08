// bank.js
var jsonStream = require('duplex-json-stream')
var net = require('net')
var m_Balance = 0
var log = []

const reducer = (accumulator , currentValue) => accumulator["amount"] + currentValue;

var server = net.createServer(function (socket) {
  socket = jsonStream(socket)
  console.log("Entered Bank")
  
  socket.on('data', function (msg) {
    switch(msg["cmd"]){
      case 'deposit':
      m_Balance +=  parseInt(msg["amount"])
      log.push(msg)
      m_newBalance = log.reduce(reducer); 
      break
      case 'balance':
      break
      default:
      break
    }
    
    var payload = {cmd : 'balance', balance : m_Balance}
    socket.write(payload)
    //console.log(log)
    console.log(m_newBalance)
  })
})

server.listen(3876)