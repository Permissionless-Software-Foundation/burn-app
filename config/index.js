import common from './env/common.js'
import development from './env/development.js'
import test from './env/test.js'
import production from './env/production.js'

const env = process.env.BURN_ENV || 'development'
const envConfigMap = {
  development,
  test,
  production
}

const config = envConfigMap[env] || development
export default Object.assign({}, common, config)
