const server = require('./bin/server.js')

const BurnApp = require('./bin/burn-app')
const burnApp = new BurnApp()

server.startServer()

burnApp.monitorAddress()
