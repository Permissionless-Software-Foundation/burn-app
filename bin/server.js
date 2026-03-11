// npm libraries
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import logger from 'koa-logger'
import mongoose from 'mongoose'
import session from 'koa-generic-session'
import passport from 'koa-passport'
import mount from 'koa-mount'
import serve from 'koa-static'
import cors from 'kcors'
// Local libraries
import config from '../config/index.js' // this first.
import AdminLib from '../src/adapters/admin.js'
import Controllers from '../src/controllers/index.js'
import '../config/passport.js'

import errorMiddleware from '../src/middleware/index.js'
import wlogger from '../src/adapters/wlogger.js'
const adminLib = new AdminLib()
async function startServer () {
  // Create a Koa instance.
  const app = new Koa()
  app.keys = [config.session]

  // Connect to the Mongo Database.
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true) // Stop deprecation warning.
  await mongoose.connect(
    config.database,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  )

  // MIDDLEWARE START

  app.use(convert(logger()))
  app.use(bodyParser())
  app.use(session())
  app.use(errorMiddleware())

  // Used to generate the docs.
  app.use(mount('/', serve(`${process.cwd()}/docs`)))

  // Mount the page for displaying logs.
  app.use(mount('/logs', serve(`${process.cwd()}/config/logs`)))

  // User Authentication
  app.use(passport.initialize())
  app.use(passport.session())

  // Attach REST API and JSON RPC controllers to the app.
  const controllers = new Controllers()
  await controllers.initAdapters()
  await controllers.initUseCases()
  await controllers.attachRESTControllers(app)

  // Enable CORS for testing
  // THIS IS A SECURITY RISK. COMMENT OUT FOR PRODUCTION
  app.use(cors({ origin: '*' }))

  // MIDDLEWARE END

  console.log(`Running server in environment: ${config.env}`)
  wlogger.info(`Running server in environment: ${config.env}`)

  await app.listen(config.port)
  console.log(`Server started on ${config.port}`)

  // Create the system admin user.
  const success = await adminLib.createSystemUser()
  if (success) console.log('System admin user created.')

  return app
}
// startServer()

// export default app
// export default app
export { startServer }
