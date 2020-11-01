'use strict';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const WebSocket = require('ws');
const socket = new WebSocket('wss://127.0.0.1:6006');

socket.addEventListener('open', (event) => {
  // This callback runs when the connection is open
  console.log("Connected!")
  const command = {
    "id": "Accept my ledger!",
    "command": "ledger_accept",
    "params" : [ { "admin_user" : "root", "admin_password" : "root" } ] 
  }
  socket.send(JSON.stringify(command))
})
socket.addEventListener('message', (event) => {
  console.log('Got message from server:', event.data)
  socket.close();
})
socket.addEventListener('close', (event) => {
  // Use this event to detect when you have become disconnected
  // and respond appropriately.
  console.log('Disconnected...')
})


