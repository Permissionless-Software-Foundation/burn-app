/*
  This file is used to store unsecure, application-specific data common to all
  environments.
*/

module.exports = {
  port: process.env.PORT || 5124,
  network: process.env.NETWORK || 'testnet',
  // tokenLiquidityAddr: 'bitcoincash:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfq8xtct0al'
  // tokenLiquidityAddr: 'bchtest:qr970jmr79dcn2ceva458vkff0vw6msg55qdfxhfyx'
  tokenLiquidityAddr: 'bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd'
}
