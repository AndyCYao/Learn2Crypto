// bank.js

var jsonStream = require('duplex-json-stream')
const sodium = require('sodium-native')

var net = require('net')

const fs = require('fs');

var log = require('./transactions.json');
// console.log(typeof(log))
// console.log(log)

var currentBalance = log.reduce(reducer, 0)

function reducer (balance, entry) {
  return balance + entry.value.amount
}

// One edge-case with referring to the previous hash is that you need a
// "genesis" hash for the first entry in the log
var genesisHash = Buffer.alloc(32).toString('hex')

function appendToTransactionLog (entry) {
  var prevHash = log.length ? log[log.length - 1].hash : genesisHash
  var input  = Buffer.from(prevHash + JSON.stringify(entry))
  var output = Buffer.alloc(sodium.crypto_generichash_BYTES)
  sodium.crypto_generichash(output, input)
  log.push({
    value: entry,
    //hash: hashToHex(prevHash + JSON.stringify(entry))
    hash: output.toString('hex')
  })
}

var server = net.createServer(function (socket) {
  socket = jsonStream(socket)
  
  socket.on('data', function (msg) {
    isSufficient = true
    switch(msg["cmd"]){
      case 'deposit':
        currentBalance += msg.amount
        // log.push(msg)
        appendToTransactionLog(msg)

        break
      case 'balance':

        break
      case 'withdraw':
        if(currentBalance >= msg.amount){
          currentBalance -= msg.amount
          msg.amount = -1 * msg.amount
          // log.push(msg)
          appendToTransactionLog(msg)
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