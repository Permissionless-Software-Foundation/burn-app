/*
 */

const config = require('../config')

const BCHJS = require('@chris.troutner/bch-js')
let bchjs = new BCHJS()
if (config.NETWORK === 'testnet') {
  bchjs = new BCHJS({ restURL: 'http://tapi.bchjs.cash/v3/' })
}

const AppUtils = require('../src/lib/util')
const appUtils = new AppUtils()

const LOOP_INTERVAL = 5000

let _this

class BurnApp {
  constructor () {
    _this = this

    this.bchjs = bchjs

    this.appUtils = appUtils
    this.walletInfo = this.appUtils.openWallet()
    // console.log(`walletInfo: ${JSON.stringify(this.walletInfo, null, 2)}`)
  }

  // This function is executed start the app.
  monitorAddress () {
    setInterval(function () {
      _this.checkBalance()
    }, LOOP_INTERVAL)
  }

  // Check the wallet balance. Forward funds in order to burn tokens, if they
  // are above a threshold.
  async checkBalance () {
    try {
      const balance = await _this.bchjs.Blockbook.balance(
        _this.walletInfo.cashAddress
      )
      console.log(`balance: ${JSON.stringify(balance, null, 2)}`)
    } catch (err) {
      console.error(`Error in checkBalance: `, err)
    }
  }
}

module.exports = BurnApp
