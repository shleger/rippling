'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const accs = require('../accounts')

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

console.log("================START TRANSACTION==================")

const api = new RippleAPI({ server: accs.testNetServer });

api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});
api.on('connected', () => {
  console.log('==connected==');
});
api.on('disconnected', (code) => {
  // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
  // will be 1000 if this was normal closure
  if (code !== 1000) {
    console.log('Connection is closed due to error: ' + code);
  } else {
    console.log('==connection is closed normally==: ' + code);
  }
});


api.connect().then(() => {
  console.log('==start request==')
  return api.getTrustlines(accs.account2Address)

}).then(response => {
  console.log("account_lines response:", JSON.stringify(response))
  return api.disconnect();
}).catch(console.error);



