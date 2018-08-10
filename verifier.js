var log = require('./transactions.json');
var sodium = require('sodium-native')

function verifyHashChain (log){
    var genesisHash = Buffer.alloc(32).toString('hex')
    console.log("log 0 hash is " + log[0].hash)
    if(genesisHash != log[0].hash) return false

    for(i = 1; i < log.length; i++){
        var prevHash = log[i - 1].hash
        var input = Buffer.from(prevHash + JSON.stringify(log[i].value))
        var output = Buffer.alloc(sodium.crypto_generichash_BYTES)
        sodium.crypto_generichash(output, input)
        console.log("previous Hash " + log[i-1].hash 
                + "\nnew generated hash " + output.toString('hex') )
        if(log[i].hash != output.toString('hex')){
            return false
        }
    }
    return true
}

function hasher(prevHash, value){
    console.log(prevHash.toString('hex'))
    console.log(value)
    var input = Buffer.from(prevHash + JSON.stringify(value))
    // var input = Buffer.from(prevHash + value)
    var output = Buffer.alloc(sodium.crypto_generichash_BYTES)
    sodium.crypto_generichash(output, input)
    return output
}

function verifyHashChainReducer(hash, entry){
    console.log('hash is ' + hash.toString('hex'))
    // console.log( 'entry hash is ' + entry.hash.toString('hex'))
    return hasher(hash, entry.value)
}

// console.log(verifyHashChain(log))

var genesisHash = Buffer.alloc(32).toString('hex')
// var currentHash = log.reduce(verifyHashChainReducer, genesisHash )
// console.log(currentHash.toString('hex'))

var result = hasher(genesisHash, 
    log[0].value
 )

var result1 = hasher(result, 
   log[1].value
)

var result2 = hasher('2c178aa030633cf113b357dcbe68de8a597edcbc30d6799216753163676fc72b', 
    {
    "cmd": "withdraw",
    "amount": -100
   }
)

// console.log(result.toString('hex'))
// console.log(result1.toString('hex'))
// console.log(result2.toString('hex'))

var temp = {
    "cmd": "withdraw",
    "amount": -100
   }

console.log(log[1].value ===  {
    "cmd": "withdraw",
    "amount": -100
   } )

console.log(Object.prototype.toString.call(log[1].value))

console.log(Object.prototype.toString.call({
    "cmd": "withdraw",
    "amount": -100
   }))