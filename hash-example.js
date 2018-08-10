
const sodium = require('sodium-native')

var buf1 = Buffer.from("Hello, World!")
// Buffer.from("Hello, world!")
console.log('Original Buf1')
console.log(buf1.toString('hex'))

var buf2 = Buffer.alloc(sodium.crypto_generichash_BYTES) 
// why is this wrong but sodium.crypto_generichash_BYTES works

console.log('Original Buf2')
console.log(buf2.toString('hex'))
sodium.crypto_generichash(buf2, buf1)
console.log('New Buf2 Hashed')
console.log(buf2.toString('hex'))
buf3 = Buffer.from('511bc81dde11180838c562c82bb35f3223f46061ebde4a955c27b3f489cf1e03', 'hex')
console.log(buf3.toString('hex'))
console.log(buf2.equals(buf3))



// // Creating buffers
// var buf1 = Buffer.alloc(32) // Allocate empty 32 byte Buffer
// buf1 = Buffer.from('Hello') // Allocate buffer and write 'Hello world'
// // Buffer.from('48656c6c6f20776f726c64', 'hex') // Decode string from `hex`
// var buf2 = Buffer.alloc(32).fill('Hello') // Allocate 32 byte Buffer and repeat 'Hello'
// console.log(buf1)
// console.log(buf2)
// console.log(buf1.toString('base64'))
// console.log(buf2.toString('hex'))
// console.log(buf2.toString('base64'))
// // buf1.equals(buf2) // Check whether buf1 and buf2 are equal byte by byte

// // Converting to printable strings
// // buf.toString('hex') // Octets in as hexadecimal
// // buf.toString('base64') // Octets as ascii safe string (base64)