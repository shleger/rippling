'use strict';
/* import RippleAPI and support libraries */
const RippleAPI = require('ripple-lib').RippleAPI;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

/* Credentials of the account placing the order */
const myAddr = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh';
const mySecret = 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb';

/* Define the order to place here */
const myOrder = {
  'direction': 'buy',
  'quantity': {
    'currency': 'USD',
    'counterparty': 'r4pxye3954miriuLqeNZ4ZQmg25PuVDKuN',
    'value': '100'
  },
  'totalPrice': {
    'currency': 'XRP',
    'value': '1000'
  }
};

/* Milliseconds to wait between checks for a new ledger. */
const INTERVAL = 1000;
/* Instantiate local RippleAPI. */
const api = new RippleAPI({
    server: 'wss://ECSD00300B99.epam.com:6006' // local rippled server
  });
/* Number of ledgers to check for valid transaction before failing */
const ledgerOffset = 5;
const myInstructions = {maxLedgerVersionOffset: ledgerOffset};


/* Verify a transaction is in a validated XRP Ledger version */
function verifyTransaction(hash, options) {
  console.log('Verifying Transaction');
  return api.getTransaction(hash, options).then(data => {
    console.log('Final Result: ', data.outcome.result);
    console.log('Validated in Ledger: ', data.outcome.ledgerVersion);
    console.log('Sequence: ', data.sequence);
    return data.outcome.result === 'tesSUCCESS';
  }).catch(error => {
    /* If transaction not in latest validated ledger,
       try again until max ledger hit */
    if (error instanceof api.errors.PendingLedgerVersionError) {
      return new Promise((resolve, reject) => {
        setTimeout(() => verifyTransaction(hash, options)
		.then(resolve, reject), INTERVAL);
      });
    }
    return error;
  });
}


/* Function to prepare, sign, and submit a transaction to the XRP Ledger. */
function submitTransaction(lastClosedLedgerVersion, prepared, secret) {
  const signedData = api.sign(prepared.txJSON, secret);
  return api.submit(signedData.signedTransaction).then(data => {
    console.log('Tentative Result: ', data.resultCode);
    console.log('Tentative Message: ', data.resultMessage);
    /* The tentative result should be ignored. Transactions that succeed here can ultimately fail,
       and transactions that fail here can ultimately succeed. */

    /* Begin validation workflow */
    const options = {
      minLedgerVersion: lastClosedLedgerVersion,
      maxLedgerVersion: prepared.instructions.maxLedgerVersion
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => verifyTransaction(signedData.id, options)
	.then(resolve, reject), INTERVAL);
    });
  });
}


// ------main-----

api.connect().then(() => {
  console.log('Connected');
  return api.prepareOrder(myAddr, myOrder, myInstructions);
}).then(prepared => {
  console.log('Order Prepared');
  return api.getLedger().then(ledger => {
    console.log('Current Ledger', ledger.ledgerVersion);
    return submitTransaction(ledger.ledgerVersion, prepared, mySecret);
  });
}).then(() => {
  api.disconnect().then(() => {
    console.log('api disconnected');
    process.exit();
  });
}).catch(console.error);