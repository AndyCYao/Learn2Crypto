// teller.js
var jsonStream = require('duplex-json-stream')
var net = require('net')

var client = jsonStream(net.connect(3876))

client.on('data', function (msg) {
  console.log('Teller received:', msg)
})

var id, value, publicKey, secretKey, signature
var args = process.argv
const sign      = require('./sign.js')
const sodium    = require('sodium-native')
var customerRef = require('./customerRef.json')
const fs        = require('fs');

customerData = customerRef.filter(val => {
  return val.customerId == args[3]
})


if(customerData && customerData.length){
  publicKey = customerData[0].publicKey
  secretKey = customerData[0].secretKey
  signature = sign.sign("00", secretKey).toString('hex')
}

switch(args[2]){
  case 'deposit':
    value = parseFloat(args[4])
    var payload = {customerId: publicKey, cmd: 'deposit', amount: value,
                   signature: signature}
  break 
  case 'balance':
    var payload = {customerId: publicKey, cmd: 'balance',
                   signature: signature}
  break
  case 'withdraw':
    value = parseFloat(args[4])
    var payload = {customerId: publicKey, cmd: 'withdraw', amount: value,
                   signature: signature}
  default:
  case 'register':
    console.log(customerData.length)
    if (customerData.length == 0){
      publicKey     = Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES)
      secretKey     = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES)
      sodium.crypto_sign_keypair(publicKey, secretKey)
      var data = {
        customerId : args[3],
        publicKey  : publicKey.toString('hex'),
        secretKey  : secretKey.toString('hex')
      }
      customerRef.push(data)
      fs.writeFile('customerRef.json', JSON.stringify(customerRef, null, 1), (error) => { /* handle error */ })
      var payload = {cmd: 'register', customerId : publicKey.toString('hex')}
    }else{
      console.error("Failed to register, already exist")
    }
  break
}

client.end(payload)


