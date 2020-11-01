'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const api = new RippleAPI({
  server: 'wss://ECSD00300B99.epam.com:6006' // local rippled server
});
api.connect().then(() => {
  /* begin custom code ------------------------------------ */
  const myAddress = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'; //--rootLedgerAddress
//  const myAddress = 'XVRSvxQemetkRv1B9bVYxArEvEWEEg1pu65JGZenR9MrDfk';
//  const myAddress = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh';

    
    console.log('getting account info for', myAddress);
 //   return api.generateXAddress();
    return api.getAccountInfo(myAddress);

}).then(info => {
  console.log(info);
  console.log('getAccountInfo done');

  /* end custom code -------------------------------------- */
}).then(() => {
  return api.disconnect();
}).then(() => {
  console.log('done and disconnected.');
}).catch(console.error);


const address = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
const payment = {
  "source": {
    "address": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
    "maxAmount": {
      "value": "0.01",
      "currency": "USD",
      "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
    }
  },
  "destination": {
    "address": "rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo",
    "amount": {
      "value": "0.01",
      "currency": "USD",
      "counterparty": "rMH4UxPrbuMa1spCBR98hLLyNJp4d8p4tM"
    }
  }
};
return api.preparePayment(address, payment).then(prepared => {
    /* ... */
}).catch(error => {
    console.log('done and disconnected.' + error);
    /* ... as with all prepare* methods, use a Promise catch block to handle errors ... */
  })

//getting account info for rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
//{
//  xAddress: 'XVhxx9wsaNzDa4kBgQ3JRNKZWkYecR87VFPakocTZ1WGaqu',
//  secret: 'sh31QVXD89JSewJRrVVs3NRhZNH45'
//}
//getAccountInfo done
//done and disconnected.
