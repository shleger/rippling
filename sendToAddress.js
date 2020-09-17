'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const api = new RippleAPI({
  server: 'wss://ECSD00300B99.epam.com:6006' // local rippled server
});
api.connect()
/*
api.connect().then(() => {

//  const myAddress = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'; --rootLedgerAddress
  const myAddress = 'XVRSvxQemetkRv1B9bVYxArEvEWEEg1pu65JGZenR9MrDfk';

    
    console.log('getting account info for', myAddress);
 //   return api.generateXAddress();
    return api.getAccountInfo(myAddress);

}).then(info => {
  console.log(info);
  console.log('getAccountInfo done');


}).then(() => {
  return api.disconnect();
}).then(() => {
  console.log('done and disconnected.');
}).catch(console.error);

*/

const address = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh';
const payment = {
  "source": {
    "address": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
      "maxAmount": {
	  "currency": "drops",
	  "value": "3000000"
    }
  },
  "destination": {
      "address": "XVRSvxQemetkRv1B9bVYxArEvEWEEg1pu65JGZenR9MrDfk",
      tag: '30000',
      "maxAmount": {
	  "currency": "drops",
	  "value": "3000000"
      }
    }
}


api.connect().then(() => {
  console.log('Connected...');
  return api.preparePayment(srcAddress, payment).then(prepared => {
    console.log('Payment transaction prepared...');
    const {signedTransaction} = api.sign(prepared.txJSON, secret);
    console.log('Payment transaction signed...');
    api.submit(signedTransaction).then(quit, fail);
  });
}).catch(error => {
     console.log('Result: ' + error);
   })

// return api.preparePayment(address, payment).then(prepared => {
// }).catch(error => {
//     console.log('Result: ' + error);
//   })

//getting account info for rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
//{
//  xAddress: 'XVhxx9wsaNzDa4kBgQ3JRNKZWkYecR87VFPakocTZ1WGaqu',
//  secret: 'sh31QVXD89JSewJRrVVs3NRhZNH45'
//}
//getAccountInfo done
//done and disconnected.
