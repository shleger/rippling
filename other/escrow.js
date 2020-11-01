'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

console.log("================START TRANSACTION==================")

const api = new RippleAPI({
  server: 'wss://localhost:6006' // local rippled server
});


const senderAddres = "rBTsTvuRNVUtsM1UjbZ3xAua1AtWKiwtoE"
const senderSecret = "shuckeHBrsn9SupNVGkGWuLv3muo3";

//sender 220 - raRrtqnF2yyjSw9mixgwckgbxC7Kf9DTWi
// reciever - rnJ4VcgLwMZTsC17nKAwvoBAochessgaep


const escrowCreation = {
  "destination": "rUZG6irJ75pNutca3KEcS9UcuSDbS7BNQ3",
  "amount": "20",
  "allowExecuteAfter": "2020-09-24T21:21:50.000Z",
  "allowCancelAfter":  "2021-01-01T00:00:00.000Z"
};


async function doPrepare() {
  return api.prepareEscrowCreation(senderAddres,escrowCreation);
}




// use txBlob from the previous example
async function doSubmit(txBlob) {
  const latestLedgerVersion = await api.getLedgerVersion()

  const result = await api.submit(txBlob)


  console.log("Tentative result code:", result.resultCode)
  console.log("Tentative result message:", result.resultMessage)

  // Return the earliest ledger index this transaction could appear in
  // as a result of this submission, which is the first one after the
  // validated ledger at time of submission.
  return latestLedgerVersion + 1
}

async function getTran(txID, minLedgerVersion) {
  try {
    tx = await api.getTransaction(txID, { minLedgerVersion: minLedgerVersion })
    console.log("Transaction result:", tx.outcome.result)
    console.log("Balance changes:", JSON.stringify(tx.outcome.balanceChanges))
  } catch (error) {
    console.log("Couldn't get transaction outcome:", error)
  }
}

// ------main----- dont forget apply ladger: rippled ledger_accept --conf ~/dev/ripple/cfg/rippled.cfg

var txIdGlobal;

api.connect().then(() => {
  console.log('Connected');
  return doPrepare()
}).then(prepared => {
  const prepJson = prepared.txJSON;
  console.log('Order Prepared: ' + prepJson);

  const response = api.sign(prepJson, senderSecret)
  const txID = response.id
  txIdGlobal = txID
  console.log("Identifying hash:", txID)
  const txBlob = response.signedTransaction
  console.log("Signed blob:")

  return txBlob;
}).then(blob => {
  console.log('Order Prepared txBlob: ' + blob);
  return doSubmit(blob);
}).then((ladgerNumber) => {
  console.log('ledgerNumber: ', ladgerNumber);
  return api.on('ledger', ledger => {
    console.log("Ledger version", ledger.ledgerVersion, "was validated??.")
    if (ledger.ledgerVersion > maxLedgerVersion) {
      console.log("If the transaction hasn't succeeded by now, it's expired")
    }
  })
}).then((validated) => {
  console.log('validated:' + validated);
  //TODO return getTran(txIdGlobal)
}).then(() => {
  api.disconnect().then(() => {
    console.log('api disconnected');
    process.exit();
  });
}).catch(console.error);

//--- end main ----


