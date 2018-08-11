const sodium   = require('sodium-native')

module.exports = {
    verify: function(signature, publicKey, message ){
        return sodium.crypto_sign_verify_detached(signature, message, publicKey)
    }
}
