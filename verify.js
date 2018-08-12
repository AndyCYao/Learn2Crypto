const sodium   = require('sodium-native')

module.exports = {
    verify: function(signature, publicKey, message ){
        var buf_signature = Buffer.from(signature, 'hex')
        var buf_message   = Buffer.from(message, 'hex')
        var buf_publicKey = Buffer.from(publicKey, 'hex')
        var result =  sodium.crypto_sign_verify_detached(buf_signature, buf_message, buf_publicKey)
        return result
    }
}
