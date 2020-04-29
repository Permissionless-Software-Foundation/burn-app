/*
  Library for working with BCH.
*/

const config = require('../../config')

const BCHJS = require('@chris.troutner/bch-js')
let bchjs = new BCHJS()
if (config.network === 'testnet') {
  bchjs = new BCHJS({ restURL: config.bchServer })
}

const AppUtils = require('./util')
const appUtils = new AppUtils()

const wlogger = require('./wlogger')

let _this

class BCH {
  constructor () {
    _this = this

    this.bchjs = bchjs

    this.appUtils = appUtils
    this.walletInfo = this.appUtils.openWallet()
  }

  // Send the balance of the wallet to the token-liquidity app to burn tokens.
  async sendAll (inObj) {
    try {
      // const utxos = await _this.getAllUtxos()
      const utxos = await _this.bchjs.Blockbook.utxo(
        _this.walletInfo.cashAddress
      )
      wlogger.info(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      if (utxos.length === 0) throw new Error('No UTXOs found.')

      const sendToAddr = config.tokenLiquidityAddr

      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      // if (!Array.isArray(utxos)) throw new Error(`utxos must be an array.`)

      if (utxos.length === 0) throw new Error('No utxos found.')

      // instance of transaction builder
      let transactionBuilder
      if (config.network === 'testnet') {
        transactionBuilder = new this.bchjs.TransactionBuilder('testnet')
      } else transactionBuilder = new this.bchjs.TransactionBuilder()

      let originalAmount = 0

      // Calulate the original amount in the wallet and add all UTXOs to the
      // transaction builder.
      for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]

        originalAmount = originalAmount + utxo.satoshis

        // Validate UTXO with full node.
        const txout = await this.bchjs.Blockchain.getTxOut(utxo.txid, utxo.vout)
        if (txout === null) {
          throw new Error('stale utxo detected.')
        }

        transactionBuilder.addInput(utxo.txid, utxo.vout)
      }

      if (originalAmount < 1) {
        throw new Error('Original amount is zero. No BCH to send.')
      }

      // original amount of satoshis in vin
      console.log(`originalAmount: ${originalAmount}`)

      // get byte count to calculate fee. paying 1 sat/byte
      const byteCount = this.bchjs.BitcoinCash.getByteCount(
        { P2PKH: utxos.length },
        { P2PKH: 2 }
      )
      const fee = Math.ceil(1.1 * byteCount)
      // console.log(`fee: ${byteCount}`)

      // Add the OP_RETURN to the transaction.
      const script = [
        this.bchjs.Script.opcodes.OP_RETURN,
        Buffer.from('6d02', 'hex'), // Makes message comply with the memo.cash protocol.
        Buffer.from('BURN')
      ]

      // Compile the script array into a bitcoin-compliant hex encoded string.
      const data = this.bchjs.Script.encode(script)

      // Add the OP_RETURN output.
      transactionBuilder.addOutput(data, 0)

      // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
      const sendAmount = originalAmount - fee
      console.log(`sendAmount: ${sendAmount}`)

      console.log(`sendToAddr: ${sendToAddr}`)
      // console.log(
      //   `sendToAddr: ${this.bchjs.Address.toLegacyAddress(sendToAddr)}`
      // )

      // add output w/ address and amount to send
      transactionBuilder.addOutput(
        this.bchjs.Address.toLegacyAddress(sendToAddr),
        sendAmount
      )

      let redeemScript

      let totalSats = 0

      // Loop through each input and sign
      for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]

        // Generate a keypair for the current address.
        const change = await this.changeAddrFromMnemonic()
        const keyPair = this.bchjs.HDNode.toKeyPair(change)

        transactionBuilder.sign(
          i,
          keyPair,
          redeemScript,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          utxo.satoshis
        )

        // Total up the output.
        totalSats += utxo.satoshis
      }

      if (totalSats < 546) {
        throw new Error(`Total output is ${totalSats} satoshis, which is less than the dust amount of 546.`)
      }

      // build tx
      const tx = transactionBuilder.build()

      // output rawhex
      const hex = tx.toHex()
      // console.log(`Transaction raw hex: ${hex}`)

      return hex
    } catch (err) {
      wlogger.error('Error in bch.js/sendAll()')
      throw err
    }
  }

  // Generate a change address from a Mnemonic of a private key.
  async changeAddrFromMnemonic () {
    try {
      // root seed buffer
      const rootSeed = await this.bchjs.Mnemonic.toSeed(
        this.walletInfo.mnemonic
      )

      // master HDNode
      let masterHDNode
      if (config.network === 'testnet') {
        masterHDNode = this.bchjs.HDNode.fromSeed(rootSeed, 'testnet')
      } else masterHDNode = this.bchjs.HDNode.fromSeed(rootSeed)

      // HDNode of BIP44 account
      // console.log(`derivation path: m/44'/${walletInfo.derivation}'/0'`)
      const account = this.bchjs.HDNode.derivePath(
        masterHDNode,
        'm/44\'/145\'/0\''
      )

      // derive the first external change address HDNode which is going to spend utxo
      const change = this.bchjs.HDNode.derivePath(account, '0/0')

      // const addr = this.bchjs.HDNode.toCashAddress(change)
      // console.log(`addr: ${addr}`)

      return change
    } catch (err) {
      console.log('Error in bchjs.js/changeAddrFromMnemonic()')
      throw err
    }
  }

  // Broadcasts the transaction to the BCH network.
  // Expects a hex-encoded transaction generated by sendBCH(). Returns a TXID
  // or throws an error.
  async broadcastTx (hex) {
    try {
      const txid = await this.bchjs.RawTransactions.sendRawTransaction([hex])

      return txid
    } catch (err) {
      console.log('Error in bchjs.js/broadcastTx()')
      throw err
    }
  }
}

module.exports = BCH
