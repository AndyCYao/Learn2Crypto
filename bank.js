// bank.js

var jsonStream = require('duplex-json-stream')
const sodium   = require('sodium-native')
var net        = require('net')
const fs       = require('fs');
var log        = require('./transactions.json');

// One edge-case with referring to the previous hash is that you need a
// "genesis" hash for the first entry in the log
var genesisHash = Buffer.alloc(32).toString('hex')

function hasher(prevHash, value){
  var input  = Buffer.from(prevHash + JSON.stringify(value))
  var output = Buffer.alloc(sodium.crypto_generichash_BYTES)
  sodium.crypto_generichash(output, input)
  return output
}

function verifyHashChainReducer(hash, item){
  var returned = hasher(hash, item.value)
  return returned.toString('hex')
}

function isVerified(log){
  if(log.length > 0){
    var currentHash = log.reduce(verifyHashChainReducer, genesisHash)
    return currentHash == log[log.length - 1].hash
  }
  else{
    return true
  }
}

function reducer (balance, entry) {
  return balance + entry.value.amount
}
var currentBalance = log.reduce(reducer, 0)


function appendToTransactionLog (entry) {
  var prevHash = log.length ? log[log.length - 1].hash : genesisHash
  var currentHash = hasher(prevHash , entry)
  log.push({
    value: entry,
    hash: currentHash.toString('hex')
  })
}

var server = net.createServer(function (socket) {
  socket = jsonStream(socket)
  
  socket.on('data', function (msg) {
    
    if(!isVerified(log)) {
      var payload = "error, bank has corrupted data"
      socket.write(payload)
      return
    }

    isSufficient = true
    switch(msg["cmd"]){
      case 'deposit':
        currentBalance += msg.amount
        appendToTransactionLog(msg)

        break
      case 'balance':

        break
      case 'withdraw':
        if(currentBalance >= msg.amount){
          currentBalance -= msg.amount
          msg.amount = -1 * msg.amount
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

server.listen(3876)