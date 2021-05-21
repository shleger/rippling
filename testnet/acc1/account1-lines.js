'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const accs = require('../accounts')

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

console.log("================START TRANSACTION==================")

const api = new RippleAPI({server: accs.testNetServer});

api.connect().then(() => {
  console.log('Connected')

  const account_objects_request = {
    command: "account_lines",
    account: accs.account1Address,
    ledger_index: "validated",
    type: "check"
  }
//return api.connection.request(account_objects_request)
  return api.getTrustlines(accs.account1Address)
}).then(response => {
  console.log("account_lines response:", JSON.stringify(response))

  // Disconnect and return
}).then(() => {
  api.disconnect().then(() => {
    console.log('Disconnected')
    process.exit()
  })
}).catch(console.error)

// Connected
// account_lines response: {"account":"rH5CVpD819ncwjzixJjHyrTPDGopEJuhHB",
// "ledger_hash":"B32C3FD87CF04227213D6473071550600AF99F71A3ECB2A6356D9439E498726E","ledger_index":17467101,"lines":[{"account":"rNnjjJvBmrkboPfUEaD459MrnMLUDgB67x","balance":"6","currency":"EUR","limit":"100","limit_peer":"100","no_ripple":false,"no_ripple_peer":false,"quality_in":0,"quality_out":0},{"account":"rNnjjJvBmrkboPfUEaD459MrnMLUDgB67x","balance":"15","currency":"USD","limit":"100","limit_peer":"100","no_ripple":false,"no_ripple_peer":false,"quality_in":0,"quality_out":0}],"validated":true}
// Disconnected



