const sodium   = require('sodium-native')

module.exports = {
    sign : function (message, publicKey, secretKey){
        // var publicKey     = Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES)
        // var secretKey     = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES)
        var signature     = Buffer.alloc(sodium.crypto_sign_BYTES)
        var buf_message   = Buffer.from(message)
        // sodium.crypto_sign_keypair(publicKey, secretKey)
    
        sodium.crypto_sign_detached(signature, buf_message, secretKey)
        return [signature, buf_message]
    }
}

// This is just for testing can ignore
// var message =  process.argv[2]
// var result = sign(message)
// console.log(result[0].toString('hex'))
// console.log(result[1].toString('hex'))
// console.log(result[2].toString('hex'))

// console.log(verifier.verify(result[0], result[1], result[2]))
