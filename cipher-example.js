// Encrypt
const sodium = require('sodium-native')

var secretKey = Buffer.alloc(sodium.crypto_secretbox_KEYBYTES)
var nonce     = Buffer.alloc(sodium.crypto_secretbox_NONCEBYTES)
// sodium.randombytes_buf(nonce)

const cipher    = require('./transactions.log')
var buf_cipher  = Buffer.from(cipher,'hex')
// sodium.crypto_secretbox_easy(cipher, message, nonce, secretKey)


// ----- Decrypt
// var newCipher = cipher.toString('hex')
// newCipher = "a" + newCipher.substr(1,newCipher.length) 
// console.log(newCipher)
var newMsg = Buffer.alloc(sodium.crypto_generichash_BYTES)

var bool = sodium.crypto_secretbox_open_easy(newMsg, buf_cipher, nonce, secretKey)
// var bool = sodium.crypto_secretbox_open_easy(newMsg, Buffer.from(newCipher,'hex'), nonce, secretKey)
console.log(bool)

console.log(newMsg)