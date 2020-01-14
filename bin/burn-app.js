/*
*/

const BCHJS = require('@chris.troutner/bch-js')
const bchjs = new BCHJS()

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
      const balance =
    } catch (err) {
      console.error(`Error in checkBalance: `, err)
    }
  }
}

module.exports = BurnApp
