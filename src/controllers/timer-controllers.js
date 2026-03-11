/*
  This Controller library is concerned with timer-based functions that are
  kicked off periodicially.
*/

// Used to retain scope of 'this', when the scope is lost.
let _this

class TimerControllers {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating Timer Controller libraries.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating Timer Controller libraries.'
      )
    }

    this.debugLevel = localConfig.debugLevel

    // Library state
    this.state = {
      checkBalanceTime: 60000 * 10
    }

    _this = this

    this.startTimers()
  }

  // Start all the time-based controllers.
  startTimers () {
    this.state.checkBalanceInterval = setInterval(this.checkBalance, this.state.checkBalanceTime)
  }

  // Poll the apps wallet address to see if it's accumulated enough BCH to
  // justify a burn tx.
  async checkBalance () {
    try {
      // Disable the timer interval while processing.
      // Note: This should be the second command.
      clearInterval(_this.state.checkBalanceInterval)

      const now = new Date()
      console.log(`checkBalance() Timer Controller has fired at ${now.toLocaleString()}`)

      await _this.adapters.bch.checkBalance()

      // Enable timer interval after processing.
      _this.state.checkBalanceInterval = setInterval(_this.checkBalance, _this.state.checkBalanceTime)

      return true
    } catch (err) {
      // Enable timer interval after processing.
      _this.state.checkBalanceInterval = setInterval(_this.checkBalance, _this.state.checkBalanceTime)

      // Do not throw an error. This is a top-level function.
      console.error('Error in timer-controllers.js/checkBalance(): ', err)

      return false
    }
  }
}

module.exports = TimerControllers
