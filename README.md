# Origin
This is based on the [Jade web upgrader code](https://github.com/Blockstream/webjadeupgrader)
and uses the [Jade API](https://github.com/Blockstream/Jade/blob/master/docs/index.rst#auth_user-request)

# Purpose
The purpose of this repo is to get a better understanding of how to talk to the Jade device from client side code: mainly to retrieve public key info and to explore on how to sign PSBTs. 

# Architecture
(At least my understanding of it).
The web worker acts as an intermediary between the client and the hardware device.
```
+-----------------+     +-----------------+     +-------------------+
| Main Thread     |     | Serial Worker   |     |       Jade        |
+-----------------+     +-----------------+     +-------------------+
|                 |     |                 |     |                   |
| jade.someFunc() |     |                 |     |                   |
|  -> CBOR.encode |     |                 |     |                   |
|                 |     |                 |     |                   |
|  postMessage()  | --> |  writer.write() | --> |                   |
|                 |     |                 |     |                   |
|  onmessage()    |     |  reader.read()  | <-- |   cbor messages   |
|                 |     |                 |     |                   |
|                 | <-- |  postMessage()  |     |                   |
|                 |     |                 |     |                   |
|                 |     |                 |     |                   |
+-----------------+     +-----------------+     +-------------------+
```

So you need
- A serial worker
- A CBOR encoder/decoder
- JS code to talk to the serial worker (done in `jade.js`).


