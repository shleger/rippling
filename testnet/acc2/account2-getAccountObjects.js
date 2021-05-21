'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const accs = require('../accounts')

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

console.log("================START TRANSACTION==================")

const api = new RippleAPI({server: accs.testNetServer});

api.connect().then(() => {
  console.log('Connected')

  return api.getAccountObjects(accs.account2Address)
}).then(response => {
  console.log("account_lines response:", JSON.stringify(response))

  // Disconnect and return
}).then(() => {
  api.disconnect().then(() => {
    console.log('Disconnected')
    process.exit()
  })
}).catch(console.error)


