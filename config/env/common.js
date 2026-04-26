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

  tokenLiquidityAddr: 'bitcoincash:qze5hvl8jpaej4mnv9dxxatae076sc59zyz6pzqe8e',

  // bchServer: 'https://api.fullstack.cash/v5/'
  bchServer: process.env.BCH_SERVER ? process.env.BCH_SERVER : 'http://192.168.2.127:5942/v6/'
}

export default config
