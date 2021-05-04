'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const accs = require('../accounts')

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

console.log("================START TRANSACTION==================")

const api = new RippleAPI({server: accs.testNetServer});

api.connect().then(() => {
  console.log('Connected')

  const account_objects_request = {
    command: "account_objects",
    account: accs.account2Address,
    ledger_index: "validated",
    type: "check"
  }

  return api.connection.request(account_objects_request)
}).then(response => {
  console.log("account_objects response:", JSON.stringify(response))

  // Disconnect and return
}).then(() => {
  api.disconnect().then(() => {
    console.log('Disconnected')
    process.exit()
  })
}).catch(console.error)


