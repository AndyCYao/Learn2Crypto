
// bank.js
const jsonStream          = require('duplex-json-stream')
const sodium              = require('sodium-native')
const net                 = require('net')
const fs                  = require('fs');
const transactions        = require('./transactions.json');
const sign                = require('./sign.js')
const verify              = require('./verify.js')
const encrypt             = require('./encrypt.js')
const decrypt             = require('./decrypt.js')

// One edge-case with referring to the previous hash is that you need a
// "genesis" hash for the first entry in the log
var genesisHash = Buffer.alloc(32).toString('hex')

// Check if existing key-pair is stored on disk, if so load it
var keyPair   = require('./keys.json')
var secretKey, publicKey, encryptionKey, nonce, log
if (Object.keys(keyPair).length > 0){
  secretKey = keyPair.secretKey 
  publicKey = keyPair.publicKey
  encryptionKey = Buffer.from(keyPair.encryptionKey, 'hex')
  var cipher = Buffer.from(transactions.cipher,'hex')
  var nonce  = Buffer.from(transactions.nonce, 'hex')
  var results = decrypt.decrypt(nonce, encryptionKey,cipher)
  if (!results[0]){ console.error("error decrypting transactions")}
  log = JSON.parse(results[1].toString())
}
else{
  publicKey     = Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES)
  secretKey     = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES)
  sodium.crypto_sign_keypair(publicKey, secretKey)
  // nonce         = Buffer.alloc(sodium.crypto_secretbox_NONCEBYTES)
  encryptionKey = Buffer.alloc(sodium.crypto_secretbox_KEYBYTES)
  sodium.randombytes_buf(encryptionKey)
  var keys = {"secretKey" : secretKey.toString('hex'), 
              "publicKey" : publicKey.toString('hex'),
              "encryptionKey": encryptionKey.toString('hex')
             }
  fs.writeFile('keys.json', JSON.stringify(keys, null, 1), (error) => { /* handle error */ })
  // in here we know log is new, since no encryption key
  log = []
}



function hasher(prevHash, value){
  var input  = Buffer.from(prevHash + JSON.stringify(value))
  var output = Buffer.alloc(sodium.crypto_generichash_BYTES)
  sodium.crypto_generichash(output, input)
  return output
}

function verifyHashChainReducer(hash, item){
  var output = hasher(hash, item.value)
  return output.toString('hex')
}

function isVerified(log){
  if(log.length > 0){
    for(var i = 0; i < log.length ; i++){
      if(!verify.verify(log[i].signature, publicKey, log[i].hash)){
        // console.log("transaction " + i + " is unverified")
        return false
      }
    }
    var currentHash = log.reduce(verifyHashChainReducer, genesisHash);
    return currentHash == log[log.length - 1].hash 
  }
  return true
}

function reducer (balance, entry) {
  return balance + entry.value.amount
}


function appendToTransactionLog (entry) {
  var prevHash = log.length ? log[log.length - 1].hash : genesisHash
  var currentHash = hasher(prevHash , entry).toString('hex')
  
  log.push({
    value: entry,
    hash: currentHash,
    signature: sign.sign(currentHash, secretKey).toString('hex')
  })
}


if(isVerified(log)) {
  var server = net.createServer(function (socket) {
    socket = jsonStream(socket)
    socket.on('data', function (msg) {
      console.log("*** incoming message \n" + JSON.stringify(msg,null, 1))
      var customerLog    = log.filter(val => {
        return val.value.customerId == msg.customerId
      }) 
      console.log("*** customer log message \n" + JSON.stringify(customerLog, null, 1))

      var currentBalance = customerLog.reduce(reducer, 0) // here need to take in the id in the reduce
      isSufficient = true
      switch(msg.cmd){
        case 'deposit':
          currentBalance += msg.amount
          appendToTransactionLog(msg)
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
        case 'balance':
          break
        default:
          break
      }
      if(isSufficient){
        // var payload = {cmd : 'balance', balance : log.reduce(reducer, 0)}
        var payload = {cmd : 'balance', balance : currentBalance}
        nonce   = Buffer.alloc(sodium.crypto_secretbox_NONCEBYTES)
        sodium.randombytes_buf(nonce)
        cipher = encrypt.encrypt(log, encryptionKey, nonce)
        var encryptedLog = {
          'cipher' : cipher.toString('hex'),
          'nonce'  : nonce.toString('hex')
        }
        // fs.writeFile('transactions.json', JSON.stringify(log, null, 1), (error) => { /* handle error */ })
        fs.writeFile('transactions.json', JSON.stringify(encryptedLog, null, 1), (error) => { /* handle error */ })
      } 
      else{
        var payload = "Insufficient fund"
      }
      socket.write(payload)
      console.log("**** Current Log\n" + JSON.stringify(log,null,1 ))
    })
  })
  server.listen(3876)
}
else{
  console.log("error, the log has corrupted data")
  return 
}
