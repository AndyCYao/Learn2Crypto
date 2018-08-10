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


function verifyHashChainReducer(hash, entry){
    
}

console.log(verifyHashChain(log))