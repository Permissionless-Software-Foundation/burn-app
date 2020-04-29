/*
 */

const config = require('../config')
const wlogger = require('../src/lib/wlogger')

const BCHJS = require('@chris.troutner/bch-js')
let bchjs = new BCHJS()
if (config.network === 'testnet') {
  bchjs = new BCHJS({ restURL: 'http://tapi.fullstack.cash/v3/' })
}

const BCH = require('../src/lib/bch')
const bch = new BCH()

const AppUtils = require('../src/lib/util')
const appUtils = new AppUtils()

const LOOP_INTERVAL = 60000 * 0.5
// const BALANCE_THRESHOLD = 10000 // Satoshis
const BALANCE_THRESHOLD = 1000 // Satoshis

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
      if (balance > 0) {
        console.log(`balance: ${JSON.stringify(balance, null, 2)}`)
      }

      if (balance > BALANCE_THRESHOLD) {
        wlogger.info(
          `Forwarding balance of ${balance} satoshis to token-liquidity app.`
        )
        try {
          const hex = await _this.bch.sendAll()

          const txid = await _this.bch.broadcastTx(hex)
          wlogger.info(`txid: ${txid}`)
        } catch (err) {
          console.log(`Error encountered: ${err.message}`)
        }
      }
    } catch (err) {
      console.error('Error in checkBalance: ', err)
    }
  }
}

module.exports = BurnApp
