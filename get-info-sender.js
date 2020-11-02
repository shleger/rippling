'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const api = new RippleAPI({
  server: 'wss://localhost:6006' // local rippled server
});
api.connect().then(() => {
  /* begin adress to check ------------------------------------ */
  const myAddress = 'rf52DMnAZqgWFjs6Pa8Lijis94Fbu8rmA7'; 
  
  // Reciever address: {} rf52DMnAZqgWFjs6Pa8Lijis94Fbu8rmA7
//   Reciever secret: {} shDpZxDQwqrE1FEcgH1xeEjttwef5

    
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

