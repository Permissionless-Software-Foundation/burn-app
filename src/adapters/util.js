/*
  This library contains general utility functions. This library is specific
  to token-liquidty, which is why its in the lib/ folder and not the utils/
  folder.
*/

'use strict'

// const config = require('../../config')
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import config from '../../config/index.js'
// Winston logger
import wlogger from './wlogger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
class TLUtils {
  // constructor () {}

  // Round a number to 8 decimal places, the standard used for Bitcoin.
  round8 (numIn) {
    return Math.floor(numIn * 100000000) / 100000000
  }

  // Save the app state to a JSON file.
  saveState (data) {
    try {
      wlogger.silly('entering util.js/saveState().')

      const filename = `${__dirname.toString()}/../../state/state.json`

      return new Promise((resolve, reject) => {
        fs.writeFile(filename, JSON.stringify(data, null, 2), function (err) {
          if (err) {
            wlogger.error('Error in token-util.js/saveState(): ', err)
            return reject(err)
          }

          wlogger.silly('Successfully saved to state.json')

          // console.log(`${name}.json written successfully.`)
          return resolve()
        })
      })
    } catch (err) {
      wlogger.debug('Error in token-util.js/saveState()')
      throw err
    }
  }

  // Open and read the state JSON file.
  readState (filename) {
    try {
      const fileStr = fs.readFileSync(filename, 'utf8')
      return JSON.parse(fileStr)
    } catch (err) {
      wlogger.debug('Error in util.js/readState()')
      throw new Error(`Could not open ${filename}`)
    }
  }

  // Opens the wallet file and returns the contents.
  openWallet () {
    try {
      let walletPath

      // console.log(`config.network: ${config.network}`)
      if (config.network === 'testnet') {
        walletPath = path.join(__dirname, '../../wallet-test.json')
      } else {
        walletPath = path.join(__dirname, '../../wallet-main.json')
      }
      const walletInfo = JSON.parse(fs.readFileSync(walletPath, 'utf8'))
      // console.log(`walletInfo in slp: ${JSON.stringify(walletInfo, null, 2)}`)

      return walletInfo
    } catch (err) {
      throw new Error('wallet file not found')
    }
  }

  sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default TLUtils
