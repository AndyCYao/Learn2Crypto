const sodium = require('sodium-native')


module.exports = {
    decrypt : function (nonce, secretKey, cipher ){
        var plainText = Buffer.alloc(cipher.length - sodium.crypto_secretbox_MACBYTES)
        var result = sodium.crypto_secretbox_open_easy(plainText, cipher, nonce, secretKey)
        return plainText
    }
}
