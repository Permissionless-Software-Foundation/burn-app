/*
 */

const config = require('../config')
const wlogger = require('../src/lib/wlogger')

const BCHJS = require('@chris.troutner/bch-js')

// Instantiate the JWT handling library for FullStack.cash.
const JwtLib = require('jwt-bch-lib')
const jwtLib = new JwtLib({
  // Overwrite default values with the values in the config file.
  server: 'https://auth.fullstack.cash',
  login: process.env.FULLSTACKLOGIN,
  password: process.env.FULLSTACKPASS
})

const BCH = require('../src/lib/bch')

const AppUtils = require('../src/lib/util')
const appUtils = new AppUtils()

const LOOP_INTERVAL = 60000 * 5
// const BALANCE_THRESHOLD = 10000 // Satoshis
const BALANCE_THRESHOLD = 100000 // Satoshis

let _this

class BurnApp {
  constructor () {
    _this = this

    this.bchjs = new BCHJS()
    this.bch = new BCH()

    this.appUtils = appUtils
    this.walletInfo = this.appUtils.openWallet()
    // console.log(`walletInfo: ${JSON.stringify(this.walletInfo, null, 2)}`)
    console.log(`App address: ${this.walletInfo.cashAddress}`)

    // Renew the JWT token every 24 hours
    setInterval(async function () {
      wlogger.info('Updating FullStack.cash JWT token')
      await _this.getJwt()
    }, 60000 * 60 * 24)
    _this.getJwt()
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

  // Get's a JWT token from FullStack.cash.
  // This code based on the jwt-bch-demo:
  // https://github.com/Permissionless-Software-Foundation/jwt-bch-demo
  async getJwt () {
    try {
      // Log into the auth server.
      await jwtLib.register()

      let apiToken = jwtLib.userData.apiToken

      // Ensure the JWT token is valid to use.
      const isValid = await jwtLib.validateApiToken()

      // Get a new token with the same API level, if the existing token is not
      // valid (probably expired).
      if (!isValid.isValid) {
        apiToken = await jwtLib.getApiToken(jwtLib.userData.apiLevel)
        wlogger.info('The JWT token was not valid. Retrieved new JWT token.\n')
      } else {
        wlogger.info('JWT token is valid.\n')
      }

      // Set the environment variable.
      process.env.BCHJSTOKEN = apiToken

      // Reinstantiate bchjs library so that it uses the new JWT token.
      if (config.network === 'testnet') {
        _this.bchjs = new BCHJS({ restURL: 'http://tapi.fullstack.cash/v3/' })
        _this.bch = new BCH()
      } else {
        _this.bchjs = new BCHJS()
        _this.bch = new BCH()
      }
    } catch (err) {
      wlogger.error('Error in token-liquidity.js/getJwt(): ', err)
      throw err
    }
  }
}

module.exports = BurnApp
