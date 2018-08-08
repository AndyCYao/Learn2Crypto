// teller.js
var jsonStream = require('duplex-json-stream')
var net = require('net')

var client = jsonStream(net.connect(3876))

client.on('data', function (msg) {
  console.log('Teller received:', msg)
})

var args = process.argv
// console.log(args[2] + args[3])
switch(args[2]){

  case 'deposit':
    amount = parseFloat(args[3])
    var payload = {cmd: 'deposit', amount: amount}
  break 
  case 'balance':
    var payload = {cmd: 'balance'}
  default:
  break
}

client.end(payload)


