const sodium = require('sodium-native')


module.exports = {
    encrypt : function (log, encryptionKey, nonce){

        // var encryptionKey = Buffer.alloc(sodium.crypto_secretbox_KEYBYTES)
        // var nonce     = Buffer.alloc(sodium.crypto_secretbox_NONCEBYTES)
        // sodium.randombytes_buf(nonce)
        
        var buf_log = Buffer.from(JSON.stringify(log))
        // var buf_nonce = Buffer.from(nonce, 'hex')
        var buf_key   = Buffer.from(encryptionKey, 'hex')
        var cipher    = Buffer.alloc(buf_log.length + sodium.crypto_secretbox_MACBYTES)
        
        sodium.crypto_secretbox_easy(cipher, buf_log, nonce, buf_key)

        return cipher
    }
}
