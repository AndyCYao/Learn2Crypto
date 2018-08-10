var log = require('./transactions.json');
var sodium = require('sodium-native')

function hasher(prevHash, value){
    var input = Buffer.from(prevHash + JSON.stringify(value))
    var output = Buffer.alloc(sodium.crypto_generichash_BYTES)
    sodium.crypto_generichash(output, input)
    return output
}

function verifyHashChainReducer(hash, entry){
    var returned = hasher(hash, entry.value)
    return returned.toString('hex')
}

var genesisHash = Buffer.alloc(32).toString('hex')

function isVerified(log){
    var currentHash = log.reduce(verifyHashChainReducer, genesisHash)
    return currentHash == log[log.length - 1].hash
}

isVerified(log)