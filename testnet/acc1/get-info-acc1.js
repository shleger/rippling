'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const accs = require('../accounts');

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const api = new RippleAPI({
  server: accs.testNetServer 
});

api.connect().then(() => {
  /* begin adress to check ------------------------------------ */
  const myAddress = accs.account1Address; 
    
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

