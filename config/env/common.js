/*
  This file is used to store unsecure, application-specific data common to all
  environments.
*/

const config = {
  port: process.env.PORT || 5124,
  network: process.env.NETWORK ? process.env.NETWORK : 'testnet',
  // tokenLiquidityAddr: 'bitcoincash:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfq8xtct0al',
  // tokenLiquidityAddr: 'bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd',
  logPass: 'test',

  emailServer: process.env.EMAILSERVER ? process.env.EMAILSERVER : 'mail.someserver.com',
  emailUser: process.env.EMAILUSER ? process.env.EMAILUSER : 'noreply@someserver.com',
  emailPassword: process.env.EMAILPASS ? process.env.EMAILPASS : 'emailpassword'
}

// console.log(`config.network: ${config.network}`)
if (config.network === 'testnet') {
  config.tokenLiquidityAddr =
    'bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd'
  config.bchServer = 'htts://tapi.fullstack.cash/v3/'
} else {
  config.tokenLiquidityAddr =
    'bitcoincash:qrnn49rx0p4xh78tts79utf0zv26vyru6vqtl9trd3'
  config.bchServer = 'http://api.fullstack.cash/v3/'
}

module.exports = config
