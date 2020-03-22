/*
  This file is used to store unsecure, application-specific data common to all
  environments.
*/

const config = {
  port: process.env.PORT || 5124,
  network: process.env.NETWORK ? process.env.NETWORK : 'testnet',
  // tokenLiquidityAddr: 'bitcoincash:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfq8xtct0al',
  // tokenLiquidityAddr: 'bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd',
  logPass: 'test'
}

// console.log(`config.network: ${config.network}`)
if (config.network === 'testnet') {
  config.tokenLiquidityAddr =
    'bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd'
} else {
  config.tokenLiquidityAddr =
    'bitcoincash:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfq8xtct0al'
}

module.exports = config
