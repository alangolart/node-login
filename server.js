const setupApp = require('./app')
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})

async function startServer() {
  try {
    setupApp.listen(process.env.SERVER_PORT || 3039)
    console.log(`🚀 Listening on port ${process.env.SERVER_PORT}`)
  } catch (error) {
    console.error(error)
  }
}
startServer()
