/*
  This is a top-level library that encapsulates all the additional Adapters.
  The concept of Adapters comes from Clean Architecture:
  https://troutsblog.com/blog/clean-architecture
*/

// Load individual adapter libraries.
const LocalDB = require('./localdb')
const LogsAPI = require('./logapi')
const Passport = require('./passport')
const Nodemailer = require('./nodemailer')
const wlogger = require('./wlogger')
const JSONFiles = require('./json-files')
const config = require('../../config')
const FullStack = require('./fullstack-cash')
const BCH = require('./bch')

const ONE_HOUR = 60000 * 60
// const ONE_HOUR = 60000 * 1

let _this

class Adapters {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.localdb = new LocalDB()
    this.logapi = new LogsAPI()
    this.passport = new Passport()
    this.nodemailer = new Nodemailer()
    this.jsonFiles = new JSONFiles()
    this.config = config
    this.wlogger = wlogger
    this.fullstack = new FullStack()
    this.bch = new BCH()

    _this = this
  }

  // Startup any asynchronous processes needed to initialize the adapter libraries.
  async startAdapters () {
    try {
      // Skip this section when running automated e2e tests.
      if (this.config.env !== 'test') {
        // Get a JWT token from FullStack.cash and update the BCHJSTOKEN environment
        // variable.
        const apiToken = await this.fullstack.getJwt()

        // Start an interval to renew the JWT token.
        this.fullstackInterval = setInterval(this.refreshBchJS, ONE_HOUR)

        await this.renewBchJS(apiToken)

        console.log('Async Adapters have been started.')
      }
    } catch (err) {
      console.error('Error in adapters/index.js/startAdapters()')
      throw err
    }
  }

  // Called by a timer interval, in order to refresh the FullStack.cash JWT
  // tokens and re-instantiate any libraries that use bch-js.
  async refreshBchJS () {
    // Renew the FullStack.cash JWT token.
    const apiToken = await _this.fullstack.getJwt()

    // Update the adapter libraries that depend on bch-js.
    await _this.renewBchJS(apiToken)
  }

  // Refresh the libraries that rely on bch-js, after the FullStack.cash JWT
  // token has been renewed.
  async renewBchJS (apiToken) {
    // Reinitialize wallet with the new apiToken.
    // await _this.wallet.initWallet(this.config.mnemonic, apiToken)

    // Extract bch-js from the wallet library.
    // const bchjs = _this.wallet.bchjs

    // Re-initialized support Adapters that use bch-js
    this.bch = new BCH({ apiToken })
    // this.txs = new Transactions({ bchjs })
    // this.slp = new SLP({ wallet: _this.wallet })

    this.wlogger.info('FullStack JWT token refreshed and libraries updated.')
  }
}

module.exports = Adapters
