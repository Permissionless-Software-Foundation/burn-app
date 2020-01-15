/*
 */

const config = require('../config')

const BCHJS = require('@chris.troutner/bch-js')
let bchjs = new BCHJS()
if (config.network === 'testnet') {
  bchjs = new BCHJS({ restURL: 'http://tapi.bchjs.cash/v3/' })
}

const BCH = require('../src/lib/bch')
const bch = new BCH()

const AppUtils = require('../src/lib/util')
const appUtils = new AppUtils()

const LOOP_INTERVAL = 60000 * 0.5
const BALANCE_THRESHOLD = 0.0001

let _this

class BurnApp {
  constructor () {
    _this = this

    this.bchjs = bchjs
    this.bch = bch

    this.appUtils = appUtils
    this.walletInfo = this.appUtils.openWallet()
    // console.log(`walletInfo: ${JSON.stringify(this.walletInfo, null, 2)}`)
    console.log(`App address: ${this.walletInfo.cashAddress}`)
  }

  // This function is executed start the app.
  monitorAddress () {
    setInterval(function () {
      _this.checkBalance()
    }, LOOP_INTERVAL)

    // Start it immediately.
    _this.checkBalance()
  }

  // Check the wallet balance. Forward funds in order to burn tokens, if they
  // are above a threshold.
  async checkBalance () {
    try {
      let balance = await _this.bchjs.Blockbook.balance(
        _this.walletInfo.cashAddress
      )

      balance = Number(balance.balance) + Number(balance.unconfirmedBalance)
      console.log(`balance: ${JSON.stringify(balance, null, 2)}`)

      if (balance > BALANCE_THRESHOLD) {
        console.log(`Forwarding balance to token-liquidity app.`)
        try {
          const hex = await _this.bch.sendAll()

          const txid = await _this.bch.broadcastTx(hex)
          console.log(`txid: ${txid}`)
        } catch (err) {
          console.log(`Error encountered: ${err.message}`)
        }
      }
    } catch (err) {
      console.error(`Error in checkBalance: `, err)
    }
  }
}

module.exports = BurnApp
