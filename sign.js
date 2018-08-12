const sodium   = require('sodium-native')

module.exports = {
    sign : function (message, secretKey){

        var buf_signature = Buffer.alloc(sodium.crypto_sign_BYTES)
        var buf_message   = Buffer.from(message, 'hex')
        var buf_secretKey = Buffer.from(secretKey, 'hex')
        // sodium.crypto_sign_keypair(publicKey, secretKey)
    
        sodium.crypto_sign_detached(buf_signature, buf_message, buf_secretKey)
        return buf_signature
    }
}