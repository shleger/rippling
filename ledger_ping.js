'use strict';

const WebSocket = require('ws');
const RippleAPI = require('ripple-lib').RippleAPI;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const socket = new WebSocket('wss://localhost:6006');

socket.addEventListener('open', (event) => {
  // This callback runs when the connection is open
  console.log("Connected!")
  const command = {
    "id": "on_open_ping_1",
    "command": "ping"
  }
  
  socket.send(JSON.stringify(command))
})
socket.addEventListener('message', (event) => {
  console.log('Got message from server:', event.data)
  socket.close()
})
socket.addEventListener('close', (event) => {
  // Use this event to detect when you have become disconnected
  // and respond appropriately.
  console.log('Disconnected...')
})


