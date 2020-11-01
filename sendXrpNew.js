'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

console.log("================START TRANSACTION==================")

const api = new RippleAPI({
  server: 'wss://localhost:6006' // local rippled server
});


const dest = "rBdMc4DubG2zrZYG3gH21vUU2wmD5DNk1Q";
const senderAddress = "r3jPeLneNdgTkxXadbWDxKrLQMnVU2FCLx"
const senderSecret = "sheoYb6ZpJMJZDKi8Ex36NHKsVrfQ";

// 1
// Reciever address: {} r3jPeLneNdgTkxXadbWDxKrLQMnVU2FCLx
// Reciever secret: {} sheoYb6ZpJMJZDKi8Ex36NHKsVrfQ

// 2
// Reciever address: {} rBdMc4DubG2zrZYG3gH21vUU2wmD5DNk1Q
// Reciever secret: {} ssTDSDKjEAoeWrPA6or4erV2Vjadp




console.log("Reciever address: {}", dest)

async function doPrepare() {

  const preparedTx = await api.prepareTransaction({
    "TransactionType": "Payment",
    "Account": senderAddress,
     "Amount": api.xrpToDrops("10.20"), // Same as "Amount": "22000000"
    "Destination": dest
  }, {
    // Expire this transaction if it doesn't execute within ~5 minutes:
    "maxLedgerVersionOffset": 2
  })
  const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
  console.log("Prepared transaction instructions:", preparedTx.txJSON)
  console.log("Transaction cost:", preparedTx.instructions.fee, "XRP")
  console.log("Transaction expires after ledger:", maxLedgerVersion)
  return preparedTx.txJSON
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
  console.log('Order Prepared: ' + prepared);

  const response = api.sign(prepared, senderSecret)
  const txID = response.id
  txIdGlobal = txID
  console.log("Identifying hash:", txID)
  const txBlob = response.signedTransaction
  console.log("Signed blob:")

  return txBlob;
}).then(blob => {
  console.log('Order Prepared' + blob);
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
  console.log('validated');
  //TODO return getTran(txIdGlobal)
}).then(() => {
  api.disconnect().then(() => {
    console.log('api disconnected');
    process.exit();
  });
}).catch(console.error);

//--- end main ----


