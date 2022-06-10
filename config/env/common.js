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
  emailPassword: process.env.EMAILPASS ? process.env.EMAILPASS : 'emailpassword',

  fullstackAuthServer: process.env.FULLSTACK_AUTH ? process.env.FULLSTACK_AUTH : 'https://auth.fullstack.cash',
  fullstackLogin: process.env.FULLSTACKLOGIN ? process.env.FULLSTACKLOGIN : 'demo@demo.com',
  fullstackPass: process.env.FULLSTACKPASS ? process.env.FULLSTACKPASS : 'demo',
  getAPITokenAtStartup: !process.env.DO_NOT_GET_JWT,

  tokenLiquidityAddr: 'bitcoincash:qr9xtwn9u22wqh7j00fy6k4jg9ktmdn69utna2wmnh',

  bchServer: 'https://api.fullstack.cash/v5/'
}

module.exports = config
