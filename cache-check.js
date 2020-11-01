'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

console.log("================START TRANSACTION==================")

const api = new RippleAPI({
  server: 'wss://localhost:6006' // local rippled server
});


const cacheReceiverAddress = "rBdMc4DubG2zrZYG3gH21vUU2wmD5DNk1Q"
const cacheReceiverSecret = "ssTDSDKjEAoeWrPA6or4erV2Vjadp";

//"LedgerIndex" : "6874C3A047E690DF4244C6C8E0D497512D514463A10EBAE462A2B96D96C5FEF9"

// Order Prepared: {"Account":"rhZ95VuHT7P2mfPUqXRBENboKNDesruNkg","TransactionType":"CheckCash","CheckID":"FC8C39632BF1A29CDE6F572CE81D531AA252F346C232EE05A8E366A1E0FE9672","Amount":"1000000","Flags":2147483648,"LastLedgerSequence":22,"Fee":"12","Sequence":17}
// Identifying hash txID: 7C1689A99C75674FBE9068D34E01076F8860FFDAB670EECB466A8206DDC1735F
// Signed blob:
// Order Prepared txBlob: 12001122800000002400000011201B000000165018FC8C39632BF1A29CDE6F572CE81D531AA252F346C232EE05A8E366A1E0FE96726140000000000F424068400000000000000C73210390ECBEDDA4B0B31AB13D922C85C319EA5065FCC7F793C11C2E11F04A59617C9374473045022100BB0B91CE5A6CFB545DFDC8D167F5388D56C65638FB325B62D77E1881EBC1695102202A2C1008ACE7239B2C4BEA90540D49762647213AB9E503E8A45E0ED4E0CFA72B811426FCF6A4C2A20E09214990A5F7B5ECF5B7F72E64
// Tentative result code: tesSUCCESS
// Tentative result message: The transaction was applied. Only final in a validated ledger.
// ledgerNumber:  20
// validated:[object Object]
// api disconnected




const cacheCheck =  {
  "checkID": "791030A5FA904D472D82319EFF7737FC698F7248F120ACB49F6E271FF08754A8",
  "amount": {
    "currency": "XRP",
    "value": "1" // Cash for exactly 1 XRP
  }
};


async function doPrepare() {
  return api.prepareCheckCash(cacheReceiverAddress,cacheCheck);
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

  const response = api.sign(prepJson, cacheReceiverSecret)
  const txID = response.id
  txIdGlobal = txID
  console.log("Identifying hash txID:", txID)
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


