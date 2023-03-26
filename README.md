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

# Development
Run `python -m http.server 9999`
You need to go to https://cors-anywhere.herokuapp.com/corsdemo and click on "Request temporary access to the demo server" to run any functions that involve unlocking the PIN.

# Impressions

https://user-images.githubusercontent.com/70536101/227565707-b15b60b6-8bc1-4611-8ae6-ee8f4f3d4817.mov


https://user-images.githubusercontent.com/70536101/227565725-d243910a-4846-4b02-b2fa-c624ce7ee3cf.mov




