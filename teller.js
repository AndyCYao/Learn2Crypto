// teller.js
var jsonStream = require('duplex-json-stream')
var net = require('net')

var client = jsonStream(net.connect(3876))

client.on('data', function (msg) {
  console.log('Teller received:', msg)
})

var id, value
var args = process.argv

id = args[3]
switch(args[2]){
  case 'deposit':
    value = parseFloat(args[4])
    var payload = {customerId: id, cmd: 'deposit', amount: value}
  break 
  case 'balance':
    var payload = {customerId: id, cmd: 'balance'}
  break
  case 'withdraw':
    value = parseFloat(args[4])
    var payload = {customerId: id, cmd: 'withdraw', amount: value}
  default:
  case 'register':
    var payload = {cmd: 'register', customerId : id}
  break
}

client.end(payload)


