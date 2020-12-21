'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const api = new RippleAPI({
  server: 'wss://localhost:6006' // local rippled server
});
api.connect().then(() => {
  /* begin adress to check ------------------------------------ */
  const myAddress = 'rBsJ6QZQpcpE3s7YUFdpwaun4VMpXRECUb'; 

  // Reciever address: {} rBsJ6QZQpcpE3s7YUFdpwaun4VMpXRECUb
  // Reciever secret: {} spAG6SUJ7EMLtiNZ1ZAojSBPQByWC

    
    console.log('getting account info for', myAddress);
    return api.getAccountInfo(myAddress);
  /* end adress to check -------------------------------------- */

}).then(info => {
  console.log(info);
  console.log('getAccountInfo done');

  
}).then(() => {
  return api.disconnect();
}).then(() => {
  console.log('done and disconnected.');
}).catch(console.error);

